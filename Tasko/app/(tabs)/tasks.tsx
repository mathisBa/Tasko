import { ThemedText } from "@/components/ThemedText";
import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link } from "expo-router";
import { Checkbox } from "expo-checkbox";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export default function TasksScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [tasks, setTasks] = React.useState<any[]>([]);
  const insets = useSafeAreaInsets();
  useFocusEffect(
    React.useCallback(() => {
      fetch(`${apiUrl}/api/tasks`, {
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
    <View style={styles.itemContainer}>
      {getIconFromCategory(item.taskCategory)}
      <View>
        <ThemedText
          darkColor={"white"}
          lightColor={"white"}
          style={
            item.taskStatus === "done"
              ? { textDecorationLine: "line-through" }
              : {}
          }
        >
          {item.taskName}
        </ThemedText>
        <ThemedText
          darkColor={"#ada692"}
          lightColor={"#ada692"}
          style={
            item.taskStatus === "done"
              ? { textDecorationLine: "line-through" }
              : {}
          }
        >
          {new Date(item.taskDate).toLocaleString("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </ThemedText>
      </View>
      <Checkbox
        value={item.taskStatus === "done"}
        onValueChange={
          item.taskStatus === "done" ? undefined : () => setChecked(item)
        }
        color={item.taskStatus === "done" ? "#ed8c37" : undefined}
      />
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "#1B1611",
        justifyContent: "flex-start",
        flexDirection: "column",
      }}
    >
      <View style={styles.titleContainer}>
        <View style={{ width: 28 }} />
        <ThemedText darkColor={"white"} lightColor={"white"} type={"title"}>
          Tâches
        </ThemedText>
        <Link href="/addTask" asChild>
          <Pressable>
            <MaterialIcons name="add" size={28} color="white" />
          </Pressable>
        </Link>
      </View>
      <FlashList
        renderItem={renderFlashListItems}
        data={tasks}
        keyExtractor={(item) => item.id?.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        estimatedItemSize={50}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    marginHorizontal: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#3d2d1d",
    borderRadius: 8,
    borderColor: "#3d2d1d",
    paddingVertical: 8,
    marginHorizontal: 8,
  },
});

const getIconFromCategory = (category: string) => {
  switch (category) {
    case "Cleaning":
      return (
        <MaterialIcons
          style={{ backgroundColor: "#724621", borderRadius: 8, padding: 8 }}
          name="cleaning-services"
          size={24}
          color="#ed8c37"
        />
      );
    case "Tidying":
      return (
        <MaterialCommunityIcons
          style={{ backgroundColor: "#724621FF", borderRadius: 8, padding: 8 }}
          name="broom"
          size={24}
          color="#ed8c37"
        />
      );
    case "Laundry":
      return (
        <MaterialCommunityIcons
          style={{ backgroundColor: "#724621FF", borderRadius: 8, padding: 8 }}
          name="tshirt-crew"
          size={24}
          color="#ed8c37"
        />
      );
    case "Cooking":
      return (
        <MaterialCommunityIcons
          style={{ backgroundColor: "#724621FF", borderRadius: 8, padding: 8 }}
          name="chef-hat"
          size={24}
          color="#ed8c37"
        />
      );
    case "Shopping":
      return (
        <FontAwesome6
          style={{ backgroundColor: "#724621FF", borderRadius: 8, padding: 8 }}
          name="sack-dollar"
          size={24}
          color="#ed8c37"
        />
      );
    case "Housekeeping":
      return (
        <MaterialCommunityIcons
          style={{ backgroundColor: "#724621FF", borderRadius: 8, padding: 8 }}
          name="home-heart"
          size={24}
          color="#ed8c37"
        />
      );
    case "Gardening":
      return (
        <MaterialCommunityIcons
          style={{ backgroundColor: "#724621FF", borderRadius: 8, padding: 8 }}
          name="flower-tulip"
          size={24}
          color="#ed8c37"
        />
      );
    default:
      return null;
  }
};
