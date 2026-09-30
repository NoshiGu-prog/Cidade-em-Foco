import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const SESSION_KEY = "cidade-em-foco.session";

export async function getStoredSession(): Promise<boolean> {
  if (Platform.OS === "web") {
    return window.localStorage.getItem(SESSION_KEY) === "authenticated";
  }

  return (await AsyncStorage.getItem(SESSION_KEY)) === "authenticated";
}

export async function saveSession(): Promise<void> {
  if (Platform.OS === "web") {
    window.localStorage.setItem(SESSION_KEY, "authenticated");
    return;
  }

  await AsyncStorage.setItem(SESSION_KEY, "authenticated");
}

export async function clearSession(): Promise<void> {
  if (Platform.OS === "web") {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  await AsyncStorage.removeItem(SESSION_KEY);
}
