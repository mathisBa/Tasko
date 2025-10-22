import { Pressable, StyleSheet, View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import StateContext from "@/app/StateContext";

export default function TasksScreen() {
  const theme = useTheme();
  const fontBody = theme.fonts.bodyMedium.fontFamily;
  const fontTitle = theme.fonts.titleMedium.fontFamily;

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { foyerId, setFoyerId } = useContext(StateContext);
  const [tasks, setTasks] = React.useState<any[]>([]);
  useFocusEffect(
    React.useCallback(() => {
      const fetchTasksForFoyer = async () => {
        try {
          const membersRes = await fetch(
            `${apiUrl}/api/members?filters[memberFoyer][documentId][$eq]=${foyerId}`
          );
          const membersData = await membersRes.json();
          const memberIds = membersData.data.map((m: any) => m.id);

          if (memberIds.length === 0) {
            setTasks([]);
            return;
          }

          const query = memberIds
            .map(
              (id: string, i: number) =>
                `filters[$or][${i}][taskMember][id][$eq]=${id}`
            )
            .join("&");

          const tasksRes = await fetch(
            `${apiUrl}/api/tasks?${query}&populate=*`
          );
          const tasksData = await tasksRes.json();

          if (!tasksRes.ok) {
            console.error("Erreur lors du fetch des tâches :", tasksData);
            return;
          }

          console.log(tasksData.data[0].taskMember.memberUsername);

          const filteredTasks = tasksData.data.filter(
            (task: any) => task.taskStatus != "done"
          );

          setTasks(filteredTasks);
        } catch (error) {
          console.error("Erreur lors du chargement des tâches :", error);
        }
      };

      fetchTasksForFoyer();
    }, [apiUrl, foyerId])
  );

  const renderFlashListItems = ({ item }: { item: any }) => (
    <View style={[styles.rowTask, { backgroundColor: theme.colors.surface }]}>
      {getIconFromCategory(item.taskCategory, theme)}
      <View style={{ flex: 1, marginHorizontal: 8 }}>
        <Text
          style={[
            {
              color: theme.colors.onBackground,
              fontFamily: fontBody,
              fontSize: 16,
            },
          ]}
        >
          {item.taskName}
        </Text>
        <Text
          style={[
            {
              color: theme.colors.onBackground,
              fontFamily: fontBody,
              fontSize: 14,
            },
          ]}
        >
          {new Date(item.taskDate).toLocaleString("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Text>
        <Text
          style={[
            {
              color: theme.colors.onBackground,
              fontFamily: fontBody,
              fontSize: 14,
            },
          ]}
        >
          {item.taskMember.memberUsername}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <View style={{ width: 28 }} />

        <Text
          style={[
            styles.title,
            {
              color: theme.colors.onBackground,
              fontFamily: fontTitle,
            },
          ]}
        >
          Tâches du foyer
        </Text>

        <Link href="/addTask" asChild>
          <Pressable>
            <Ionicons name="add" size={28} color={theme.colors.onBackground} />
          </Pressable>
        </Link>
      </View>

      <FlashList
        renderItem={renderFlashListItems}
        data={tasks}
        keyExtractor={(item) => item.id?.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
  },
  rowTask: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

const getIconFromCategory = (category: string, theme: any) => {
  const bgColor = "#583416ff";
  const iconColor = theme.colors.primary || "#ed8c37";

  switch (category) {
    case "Cleaning":
      return (
        <Ionicons
          style={{ padding: 8, borderRadius: 5, backgroundColor: bgColor }}
          name="water-outline"
          size={24}
          color={iconColor}
        />
      );
    case "Tidying":
      return (
        <Ionicons
          style={{ padding: 8, borderRadius: 5, backgroundColor: bgColor }}
          name="cube-outline"
          size={24}
          color={iconColor}
        />
      );
    case "Laundry":
      return (
        <Ionicons
          style={{ padding: 8, borderRadius: 5, backgroundColor: bgColor }}
          name="shirt-outline"
          size={24}
          color={iconColor}
        />
      );
    case "Cooking":
      return (
        <Ionicons
          style={{ padding: 8, borderRadius: 5, backgroundColor: bgColor }}
          name="restaurant-outline"
          size={24}
          color={iconColor}
        />
      );
    case "Shopping":
      return (
        <Ionicons
          style={{ padding: 8, borderRadius: 5, backgroundColor: bgColor }}
          name="cart-outline"
          size={24}
          color={iconColor}
        />
      );
    case "Housekeeping":
      return (
        <Ionicons
          style={{ padding: 8, borderRadius: 5, backgroundColor: bgColor }}
          name="home-outline"
          size={24}
          color={iconColor}
        />
      );
    case "Gardening":
      return (
        <Ionicons
          style={{ padding: 8, borderRadius: 5, backgroundColor: bgColor }}
          name="flower-outline"
          size={24}
          color={iconColor}
        />
      );
    default:
      return null;
  }
};
