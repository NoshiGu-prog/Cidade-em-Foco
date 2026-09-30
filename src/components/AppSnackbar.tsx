import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { Snackbar } from "react-native-paper";

type AppSnackbarContextValue = {
  showSnackbar: (message: string) => void;
};

const AppSnackbarContext = createContext<AppSnackbarContextValue | null>(null);

export function AppSnackbarProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const showSnackbar = (nextMessage: string) => {
    setMessage(nextMessage);
    setVisible(true);
  };

  return (
    <AppSnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        {message}
      </Snackbar>
    </AppSnackbarContext.Provider>
  );
}

export function useAppSnackbar() {
  const context = useContext(AppSnackbarContext);

  if (!context) {
    throw new Error(
      "useAppSnackbar deve ser usado dentro de AppSnackbarProvider",
    );
  }

  return context;
}
