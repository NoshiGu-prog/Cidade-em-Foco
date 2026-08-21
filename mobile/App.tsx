import { PaperProvider } from "react-native-paper";
import { LoginScreen } from "./src/screens/LoginScreen";
import { theme } from "./src/theme/theme";

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <LoginScreen />
    </PaperProvider>
  );
}
