import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type LoginNavigationProp = NativeStackNavigationProp<
  {
    Login: undefined;
    Cadastro: undefined;
    RegistroOcorrencia: undefined; // NOVO
  },
  "Login"
>;
