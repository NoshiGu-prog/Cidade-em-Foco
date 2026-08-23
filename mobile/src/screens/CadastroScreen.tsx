import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Eye } from "lucide-react-native/icons";
import React from "react";
import { ScrollView, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { InputCheckbox } from "../components/inputs/CheckboxInput";
import { InputText } from "../components/inputs/TextInput";
import { LogoWithText } from "../components/logotext";
import { colors } from "../theme/theme";

export function CadastroScreen() {
  const navigation = useNavigation();

  const [nome, setNome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [cidade, setCidade] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 24,
        gap: 16,
        flexGrow: 1,
        backgroundColor: colors.background,
      }}
    >
      <Button
        mode="text"
        onPress={() => navigation.navigate("Login" as never)}
        style={{
          alignSelf: "flex-start",
        }}
        icon={({ color, size }) => <ArrowLeft color={color} size={size} />}
      >
        Voltar para login
      </Button>
      <View style={{ flex: 1, gap: 16, justifyContent: "center" }}>
        <LogoWithText text1="Crie" text2="sua" text3="Conta" />
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            display: "flex",
            gap: 20,
          }}
        >
          <InputText
            label="Nome completo"
            value={nome}
            onChangeText={setNome}
          />
          <InputText
            label="CPF"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />
          <InputText label="Cidade" value={cidade} onChangeText={setCidade} />
          <InputText
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputText
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            right={
              <TextInput.Icon
                icon={({ color, size }) => <Eye color={color} size={size} />}
              />
            }
          />
          <InputCheckbox
            label="Declaro que as informações fornecidas são verdadeiras"
            status="indeterminate"
          />
          <Button
            mode="contained"
            style={{ height: 48, justifyContent: "center" }}
            labelStyle={{
              fontSize: 20,
              fontWeight: "bold",
              letterSpacing: 1.5,
            }}
            onPress={() => {}}
          >
            Criar conta
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
