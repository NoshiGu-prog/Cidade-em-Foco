import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { LogoWithText } from "../components/logotext";
import { colors } from "../theme/theme";

type LoginNavigationProp = NativeStackNavigationProp<
  { Login: undefined; Cadastro: undefined },
  "Login"
>;

export function LoginScreen() {
  const navigation = useNavigation<LoginNavigationProp>();

  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  return (
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
        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
      </View>
      <Button mode="contained" onPress={() => {}}>
        Entrar
      </Button>
      <Button mode="text" onPress={() => navigation.navigate("Cadastro")}>
        Criar conta
      </Button>
    </View>
  );
}
