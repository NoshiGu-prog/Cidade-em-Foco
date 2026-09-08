import { Roboto_400Regular, useFonts } from "@expo-google-fonts/roboto";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { LoginScreen } from "./src/screens/LoginScreen";

import { createStaticNavigation } from "@react-navigation/native";
import { CadastroScreen } from "./src/screens/CadastroScreen";
import { theme } from "./src/theme/theme";

import { AppSnackbarProvider } from "./src/components/AppSnackbar";
import MenuBar from "./src/components/MenuBar";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Login",
  screens: {
    Login: {
      screen: LoginScreen,
      options: { title: "Login", header: () => <></> },
    },
    Cadastro: {
      screen: CadastroScreen,
      options: {
        title: "Criar Conta",
        animation: "fade_from_bottom",
        animationDuration: 200,
        header: () => <></>,
      },
    },
    Menu: {
      screen: MenuBar,
      options: {
        title: "Menu",
        header: () => <></>,
      },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <AppSnackbarProvider>
        <Navigation />
      </AppSnackbarProvider>
    </PaperProvider>
  );
}
