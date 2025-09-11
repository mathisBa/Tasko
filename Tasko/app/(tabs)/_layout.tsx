import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HapticTab } from "@/components/HapticTab";
import { useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          shadowColor: "white",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.6,
          shadowRadius: 3,
          elevation: 15,
          ...Platform.select({ ios: { position: "absolute" }, default: {} }),
        },
        tabBarLabelStyle: {
          fontFamily: "Outfit_400Regular",
          fontSize: 12,
        },
        headerTitleStyle: {
          fontFamily: "Outfit_600SemiBold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tâches",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="list-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="foyer"
        options={{
          title: "Foyer",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="people-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Récompenses",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="trophy-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
