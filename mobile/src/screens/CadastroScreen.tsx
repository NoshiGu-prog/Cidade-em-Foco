import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native/icons";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Button } from "react-native-paper";
import { InputCheckbox } from "../components/inputs/CheckboxInput";
import { InputPassword } from "../components/inputs/PasswordInput";
import { InputText } from "../components/inputs/TextInput";
import { LogoWithText } from "../components/logotext";
import { colors } from "../theme/theme";
import { cadastroSchema, type CadastroFormData } from "../validation/schemas";

export function CadastroScreen() {
  const navigation = useNavigation();
  const form = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      cidade: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      termos: false,
    },
  });

  const onSubmit = (data: CadastroFormData) => {
    console.log("Cadastro válido", data);
  };

  return (
    <FormProvider {...form}>
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
          style={{ alignSelf: "flex-start" }}
          icon={({ color, size }) => <ArrowLeft color={color} size={size} />}
        >
          Voltar para login
        </Button>
        <View style={{ flex: 1, gap: 16, justifyContent: "center" }}>
          <LogoWithText text1="Crie" text2="sua" text3="Conta" />
          <View style={{ width: "100%", gap: 20 }}>
            <InputText name="nome" label="Nome completo" />
            <InputText name="cpf" label="CPF" keyboardType="numeric" />
            <InputText name="cidade" label="Cidade" />
            <InputText
              name="email"
              label="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InputPassword name="senha" label="Senha" />
            <InputPassword name="confirmarSenha" label="Confirme sua senha" />
            <InputCheckbox
              name="termos"
              label="Declaro que as informações fornecidas são verdadeiras"
            />
            <Button
              mode="contained"
              style={{ height: 48, justifyContent: "center" }}
              labelStyle={{
                fontSize: 20,
                fontWeight: "bold",
                letterSpacing: 1.5,
              }}
              onPress={form.handleSubmit(onSubmit, (err) =>
                console.log("erro", err),
              )}
            >
              Criar conta
            </Button>
          </View>
        </View>
      </ScrollView>
    </FormProvider>
  );
}
