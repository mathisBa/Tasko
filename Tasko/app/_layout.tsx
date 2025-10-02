import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  useFonts,
} from "@expo-google-fonts/outfit";
import React, { useEffect, useState } from "react";
import { StateContext } from "./StateContext";
import { scheduleNotifications } from "@/app/utils/notifications";

const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#fc713aff",
    secondary: "#ffb36cff",
    background: "#F9F9F9",
    backgroundLight: "#F9F9F9",
    surface: "#FFFFFF",
    onBackground: "#272727ff",
    placeholder: "#999999",
  },
  fonts: {
    ...MD3LightTheme.fonts,
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: "Outfit_400Regular",
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: "Outfit_400Regular",
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: "Outfit_600SemiBold",
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: "Outfit_600SemiBold",
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: "Outfit_600SemiBold",
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: "Outfit_600SemiBold",
    },
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#fc713aff",
    secondary: "#ffb36cff",
    background: "#221814ff",
    surface: "#312622ff",
    onBackground: "#FFFFFF",
    placeholder: "#AAAAAA",
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    bodyLarge: {
      ...MD3DarkTheme.fonts.bodyLarge,
      fontFamily: "Outfit_400Regular",
    },
    bodyMedium: {
      ...MD3DarkTheme.fonts.bodyMedium,
      fontFamily: "Outfit_400Regular",
    },
    titleLarge: {
      ...MD3DarkTheme.fonts.titleLarge,
      fontFamily: "Outfit_600SemiBold",
    },
    titleMedium: {
      ...MD3DarkTheme.fonts.titleMedium,
      fontFamily: "Outfit_600SemiBold",
    },
    labelLarge: {
      ...MD3DarkTheme.fonts.labelLarge,
      fontFamily: "Outfit_600SemiBold",
    },
    labelMedium: {
      ...MD3DarkTheme.fonts.labelMedium,
      fontFamily: "Outfit_600SemiBold",
    },
  },
};

export default function RootLayout() {
  const [userId, setUserId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
  });

  useEffect(() => {
    scheduleNotifications();
  }, []);

  if (!fontsLoaded) return null;

  const theme = colorScheme === "dark" ? customDarkTheme : customLightTheme;

  return (
    <StateContext.Provider value={{ userId, setUserId }}>
      <PaperProvider theme={theme}>
        <View
          style={[
            styles.container,
            {
              paddingTop: insets.top,
              paddingRight: insets.right,
              paddingLeft: insets.left,
            },
          ]}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="addTask" options={{ headerShown: false }} />
            <Stack.Screen
              name="auth"
              options={{
                title: "Authentification",
                headerStyle: {
                  backgroundColor: "#1B1611",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </PaperProvider>
    </StateContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
