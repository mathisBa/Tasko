import { Pressable, StyleSheet, View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import React, {useContext} from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Checkbox } from "expo-checkbox";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import StateContext from "@/app/StateContext";

export default function TasksScreen() {
  const theme = useTheme();
  const fontBody = theme.fonts.bodyMedium.fontFamily;
  const fontTitle = theme.fonts.titleMedium.fontFamily;

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { userDocId } = useContext(StateContext);

  const [tasks, setTasks] = React.useState<any[]>([]);
  useFocusEffect(
    React.useCallback(() => {
      fetch(`${apiUrl}/api/tasks?filters[taskMember][documentId][$eq]=${userDocId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const filteredTasks = data.data.filter(
            (task: any) => task.taskStatus !== "done"
          );
          setTasks(filteredTasks);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    }, [])
  );

  const setChecked = async (checkedItem: any) => {
    checkedItem.taskStatus = "done";
    try {
      await fetch(`${apiUrl}/api/tasks/${checkedItem.documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { taskStatus: checkedItem.taskStatus },
        }),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === checkedItem.id
            ? { ...task, taskStatus: checkedItem.taskStatus }
            : task
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

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
            item.taskStatus === "done" && {
              textDecorationLine: "line-through",
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
            item.taskStatus === "done" && {
              textDecorationLine: "line-through",
            },
          ]}
        >
          {new Date(item.taskDate).toLocaleString("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Text>
      </View>
      <Checkbox
        value={item.taskStatus === "done"}
        onValueChange={
          item.taskStatus === "done" ? undefined : () => setChecked(item)
        }
        color={item.taskStatus === "done" ? theme.colors.primary : undefined}
      />
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
          Tâches
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
