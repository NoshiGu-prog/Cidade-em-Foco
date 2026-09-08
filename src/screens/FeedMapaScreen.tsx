import { zodResolver } from "@hookform/resolvers/zod";
import {
  AtSign,
  Building2,
  IdCard,
  KeyRound,
  UserRound,
} from "lucide-react-native";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAppSnackbar } from "../components/AppSnackbar";
import { InputCheckbox } from "../components/inputs/CheckboxInput";
import { cpfMask, InputMask } from "../components/inputs/MaskInput";
import { InputPassword } from "../components/inputs/PasswordInput";
import { InputText } from "../components/inputs/TextInput";
import { LogoWithText } from "../components/logotext";
import { colors } from "../theme/theme";
import { useAppNavigation } from "../types/general";
import { cadastroSchema, type CadastroFormData } from "../validation/schemas";

export function FeedMapaScreen() {
  const navigation = useAppNavigation();
  const { showSnackbar } = useAppSnackbar();

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
    showSnackbar("Registro criado com sucesso!");
    setTimeout(() => {
      navigation.navigate("RegistroOcorrencia");
    }, 1000);
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
        <View
          style={{
            flex: 1,
            gap: 16,
            justifyContent: "center",
          }}
        >
          <LogoWithText text1="Crie" text2="sua" text3="Conta" />
          <View style={{ width: "100%", gap: 8 }}>
            <InputText
              name="nome"
              label="Nome completo"
              left={
                <TextInput.Icon
                  icon={() => <UserRound color={colors.brandBlue} />}
                />
              }
            />
            <InputMask
              name="cpf"
              label="CPF"
              mask={cpfMask}
              left={
                <TextInput.Icon
                  icon={() => <IdCard color={colors.brandBlue} />}
                />
              }
            />
            <InputText
              name="cidade"
              label="Cidade"
              left={
                <TextInput.Icon
                  icon={() => <Building2 color={colors.brandBlue} />}
                />
              }
            />
            <InputText
              name="email"
              label="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              left={
                <TextInput.Icon
                  icon={() => <AtSign color={colors.brandBlue} />}
                />
              }
            />
            <InputPassword
              name="senha"
              label="Senha"
              left={
                <TextInput.Icon
                  icon={() => <KeyRound color={colors.brandBlue} />}
                />
              }
            />
            <InputPassword
              name="confirmarSenha"
              label="Confirme sua senha"
              left={
                <TextInput.Icon
                  icon={() => <KeyRound color={colors.brandBlue} />}
                />
              }
            />
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
