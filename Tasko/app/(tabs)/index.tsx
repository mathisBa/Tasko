import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDARNhZguV5z-uzLU9P5jf67_mmFaY8cFjxJkn4rGxE1LBV-Zb1NKesxmUIbAGNqDj5Jyp7Evcd3StvL8ohMZ6PhuHtFgEspexGi2i2CJtqRLbp2CfuS310A6ag62wbH9tRJA7I0dusYLhvnmXsnPw2i3Id95HtHybunNcZmkB8yJCD3xbZB1QLg6VwDRNfK09d2WWmt6WUsJqFzmtU8o5JrucEdSjjq-BcKIWT2N0jLjKSj6hyKFooPmI0z2Dphl1aWFzlHfigF65j",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.subtext}>Welcome back,</Text>
              <Text style={styles.title}>Alex</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Today</Text>

          {/* Task item */}
          <View style={styles.task}>
            <TouchableOpacity style={styles.circle} />
            <View style={{ flex: 1 }}>
              <Text style={styles.taskText}>Clean the kitchen</Text>
              <Text style={styles.taskTime}>10:00 AM</Text>
            </View>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMePeUdXoHJukEcDfzmSgRpcIxZnP9vPunm8XVG9piWr5G69z_JrIJTIKvdadY6ZAm2kwYRN7tbDgK2KdHepikXA65d4qEAe6pfikdy2eX69JsOfUSs4Kr29lZ5FXK0pHTjppSxaAcgiqOy0YuqqrIjN6vN5iS0g7OJVFAvw1z4lCkPPUThdNlFSp-0YX99aKeLesXoR8mp1t5QkWIOrjMNcI0KUrrCXoVWG_uXbBAJV-yqX9zGT0j9UNBRM_SB41Npp3Ol8PZdNp6",
              }}
              style={styles.smallAvatar}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = "#f97306";

const styles = StyleSheet.create({
  
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(249,115,6,0.1)",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  subtext: { color: "#9ca3af", fontSize: 12 },
  title: { color: "white", fontSize: 18, fontWeight: "bold" },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  icon: { color: "white", fontSize: 18 },
  content: { padding: 16, gap: 16 },
  sectionTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  task: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(31,41,55,0.5)",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PRIMARY,
  },
  taskText: { color: "white", fontSize: 16 },
  taskTime: { color: "#9ca3af", fontSize: 12 },
  smallAvatar: { width: 24, height: 24, borderRadius: 12, marginLeft: 8 },
});
