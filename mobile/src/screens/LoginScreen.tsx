import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { InputPassword } from "../components/inputs/PasswordInput";
import { InputText } from "../components/inputs/TextInput";
import { LogoWithText } from "../components/logotext";
import { colors } from "../theme/theme";
import { loginSchema, type LoginFormData } from "../validation/schemas";

type LoginNavigationProp = NativeStackNavigationProp<
  { Login: undefined; Cadastro: undefined },
  "Login"
>;

export function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();

  const onSubmit = (data: LoginFormData) => {
    console.log("Login válido", data);
  };

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  return (
    <FormProvider {...form}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          backgroundColor: colors.background,
          padding: 30,
        }}
      >
        <LogoWithText text1="Cidade" text2="em" text3="Foco" />
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            display: "flex",
            gap: 20,
          }}
        >
          <Button mode="outlined" onPress={() => {}}>
            Entrar com Google
          </Button>
          <InputText
            name="email"
            label="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputPassword name="senha" label="Senha" />
        </View>
        <Button mode="contained" onPress={form.handleSubmit(onSubmit)}>
          Entrar
        </Button>
        <Button mode="text" onPress={() => navigation.navigate("Cadastro")}>
          Criar conta
        </Button>
      </View>
    </FormProvider>
  );
}
