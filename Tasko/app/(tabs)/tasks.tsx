import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BG = "#1C1610";
const CARD_BG = "rgba(44,35,26,0.5)";
const PRIMARY = "#F97306";
const ACCENT = "#A78B71";
const BORDER = "#6a4a2f";

const INITIAL_TASKS = [
  {
    id: 1,
    title: "Vacuum",
    subtitle: "Living Room",
    icon: "⬛",
    completed: false,
  },
  {
    id: 2,
    title: "Clean Countertops",
    subtitle: "Kitchen",
    icon: "🍽️",
    completed: false,
  },
  {
    id: 3,
    title: "Scrub Toilet",
    subtitle: "Bathroom",
    icon: "🚻",
    completed: false,
  },
  {
    id: 4,
    title: "Make Bed",
    subtitle: "Bedroom",
    icon: "🛏️",
    completed: false,
  },
  {
    id: 5,
    title: "Fold Laundry",
    subtitle: "Laundry Room",
    icon: "🧺",
    completed: false,
  },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggle = (id: number) =>
    setTasks((xs) =>
      xs.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        {tasks.map((t) => (
          <View key={t.id} style={styles.card}>
            <View style={styles.leftIconBox}>
              <Text style={styles.leftIconText}>{t.icon}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.title,
                  t.completed && {
                    textDecorationLine: "line-through",
                    color: "#d1c6ba",
                  },
                ]}
                numberOfLines={1}
              >
                {t.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {t.subtitle}
              </Text>
            </View>

            <Pressable
              onPress={() => toggle(t.id)}
              hitSlop={8}
              style={styles.checkboxWrap}
            >
              <View
                style={[
                  styles.checkbox,
                  t.completed && {
                    backgroundColor: PRIMARY,
                    borderColor: PRIMARY,
                  },
                ]}
              >
                {t.completed ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
            </Pressable>
          </View>
        ))}

        {/* bottom safe padding */}
        <SafeAreaView edges={["bottom"]} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "rgba(28,22,16,0.8)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#4a3421",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: { color: "white", fontSize: 20 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  content: { padding: 16, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: CARD_BG,
    padding: 12,
    borderRadius: 12,
  },
  leftIconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "rgba(249,115,6,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  leftIconText: { color: PRIMARY, fontSize: 20 },
  title: { color: "white", fontSize: 16, fontWeight: "600" },
  subtitle: { color: ACCENT, fontSize: 13, marginTop: 2 },

  checkboxWrap: { paddingLeft: 4, paddingRight: 2 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkmark: { color: "white", fontSize: 16, lineHeight: 16 },
});
