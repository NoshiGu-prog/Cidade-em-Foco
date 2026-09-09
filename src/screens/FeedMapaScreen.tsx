import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppSnackbar } from "../components/AppSnackbar";
import { useAppNavigation } from "../types/general";
import { cadastroSchema, type CadastroFormData } from "../validation/schemas";
import MapComponent from "./FeedMapa/map";

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

  return <MapComponent />;
}
