import { Roboto_400Regular, useFonts } from "@expo-google-fonts/roboto";
import { PaperProvider } from "react-native-paper";
import { LoginScreen } from "./src/screens/LoginScreen";
import { theme } from "./src/theme/theme";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <LoginScreen />
    </PaperProvider>
  );
}
