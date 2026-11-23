import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = 3333;

function getHostFromExpo(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.expoGoConfig?.debuggerHost ??
    null;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(":")[0] || null;
}

function getApiUrl(): string {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (Platform.OS === "web") {
    if (
      typeof window !== "undefined" &&
      window.location.hostname &&
      window.location.hostname !== "localhost"
    ) {
      return `http://${window.location.hostname}:${API_PORT}`;
    }

    return `http://localhost:${API_PORT}`;
  }

  const expoHost = getHostFromExpo();
  if (expoHost) {
    return `http://${expoHost}:${API_PORT}`;
  }

  return Platform.OS === "android"
    ? `http://10.0.2.2:${API_PORT}`
    : `http://localhost:${API_PORT}`;
}

export const API_URL = getApiUrl();
