import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tâches",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="foyer"
        options={{
          title: "Foyer",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="people" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Récompenses",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="star" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
