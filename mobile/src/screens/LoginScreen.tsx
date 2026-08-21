import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { colors } from "../theme/theme";

export function LoginScreen() {
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
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/images/logo_cidade_em_foco.png")}
          contentFit="contain"
          style={{ width: "100%", height: 250 }}
        />
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            gap: 6,
            marginTop: -60,
            justifyContent: "center",
            alignItems: "baseline",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: colors.brandBlue,
              fontSize: 30,
            }}
          >
            Cidade
          </Text>
          <Text
            style={{
              fontWeight: "100",
              color: colors.brandGreen,
              fontSize: 25,
            }}
          >
            em
          </Text>
          <Text
            style={{
              fontWeight: "900",
              color: colors.brandGreen,
              fontSize: 30,
            }}
          >
            Foco
          </Text>
        </View>
        s
      </View>
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
      <Button mode="text" onPress={() => {}}>
        Criar conta
      </Button>
    </View>
  );
}
