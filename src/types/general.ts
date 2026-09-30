import { useNavigation } from "@react-navigation/native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Menu: undefined;
  RegistroOcorrencia: undefined;
  FeedMapa: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type LoginNavigationProp = AppNavigationProp;

export function useAppNavigation() {
  return useNavigation<AppNavigationProp>();
}
