import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function requestPermissionsAsync() {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.error("Failed to get push token for push notification!");
      return false;
    }
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return true;
  } catch (error) {
    console.error("Error requesting permissions:", error);
    return false;
  }
}

export async function scheduleNotifications() {
  try {
    const permission = await requestPermissionsAsync();
    if (!permission) {
      return;
    }

    const intervalTrigger: Notifications.TimeIntervalTriggerInput = {
      seconds: 6000,
      repeats: true,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    };
    await Notifications.scheduleNotificationAsync({
      content: { title: "Zzzz", body: "wake up" },
      trigger: intervalTrigger,
    });

    const morningTrigger: Notifications.DailyTriggerInput = {
      hour: 10,
      minute: 0,
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
    };
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Bonjour",
        body: "Prêt pour relever les défis de la journée ?",
      },
      trigger: morningTrigger,
    });

    const eveningTrigger: Notifications.DailyTriggerInput = {
      hour: 18,
      minute: 0,
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
    };
    await Notifications.scheduleNotificationAsync({
      content: { title: "Tasko", body: "Alors, à jour dans tes Tasks ?" },
      trigger: eveningTrigger,
    });

    console.log("Notifications planifiées avec succès !");
  } catch (error) {
    console.error("Error scheduling notifications:", error);
  }
}

// Handler iOS
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
