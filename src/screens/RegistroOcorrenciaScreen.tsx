import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Image, Platform, View } from "react-native";
import { Button, Snackbar, Switch, Text } from "react-native-paper";
import { InputText } from "../components/inputs/TextInput";
import {
  ocorrenciaSchema,
  type OcorrenciaFormData,
} from "../validation/schemas";

export function RegistroOcorrenciaScreen() {
  const [mensagemVisivel, setMensagemVisivel] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [obtendoLocalizacao, setObtendoLocalizacao] = useState(false);
  const [erroLocalizacao, setErroLocalizacao] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<string | null>(null);

  const form = useForm<OcorrenciaFormData>({
    resolver: zodResolver(ocorrenciaSchema),
    defaultValues: {
      descricao: "",
      perigosa: false,
    },
  });

  const { control } = form;

  const selecionarFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  const buscarEndereco = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      const resposta = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      );

      const dados = await resposta.json();
      const address = dados.address;

      const rua =
        address?.road ??
        address?.pedestrian ??
        address?.residential;

      const bairro =
        address?.suburb ??
        address?.neighbourhood ??
        address?.quarter;

      const cidade =
        address?.city ??
        address?.town ??
        address?.municipality ??
        address?.village;

      const partes = [rua, bairro, cidade].filter(Boolean);

      return partes.length > 0 ? partes.join(", ") : dados.display_name ?? null;
    }

    const enderecos = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (enderecos.length === 0) {
      return null;
    }

    const local = enderecos[0];

    const partes = [
      local.street,
      local.district,
      local.city,
    ].filter(Boolean);

    return partes.join(", ");
  } catch (erro) {
    console.log("Erro ao buscar endereço:", erro);
    return null;
  }
};

  const obterLocalizacao = async () => {
  try {
    setObtendoLocalizacao(true);
    setErroLocalizacao(null);

    const permissao = await Location.requestForegroundPermissionsAsync();

    if (permissao.status !== "granted") {
      setErroLocalizacao("Permissão de localização não concedida.");
      return;
    }

    const posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

  const latitude = posicao.coords.latitude;
const longitude = posicao.coords.longitude;

setLocalizacao({
  latitude,
  longitude,
});

const enderecoEncontrado = await buscarEndereco(
  latitude,
  longitude,
);

  setEndereco(enderecoEncontrado);
    } catch (erro) {
      console.log("Erro ao obter localização:", erro);
      setErroLocalizacao("Não foi possível obter a localização.");
    } finally {
      setObtendoLocalizacao(false);
    }
  };

const onSubmit = (data: OcorrenciaFormData) => {
  if (!fotoUri) {
    setMensagem("Adicione uma foto antes de registrar a ocorrência.");
    setMensagemVisivel(true);
    return;
  }

  if (!localizacao) {
    setMensagem("Obtenha a localização antes de registrar a ocorrência.");
    setMensagemVisivel(true);
    return;
  }

  console.log("Ocorrência válida", {
    ...data,
    fotoUri,
    latitude: localizacao.latitude,
    longitude: localizacao.longitude,
    endereco,
  });

  setMensagem("Dados da ocorrência validados com sucesso!");
  setMensagemVisivel(true);
};

  return (
    <FormProvider {...form}>
      <View style={{ flex: 1, padding: 24, gap: 16 }}>
        <Text variant="headlineMedium">Nova ocorrência</Text>

        <Button
          mode="outlined"
          icon="camera"
          onPress={selecionarFoto}
        >
          {fotoUri ? "Trocar foto" : "Adicionar foto"}
        </Button>

        {fotoUri && (
          <Image
            source={{ uri: fotoUri }}
            style={{
              width: "100%",
              height: 220,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
        )}

        <Button
          mode="outlined"
          icon="map-marker"
          onPress={obterLocalizacao}
          loading={obtendoLocalizacao}
          disabled={obtendoLocalizacao}
        >
          {localizacao ? "Atualizar localização" : "Obter localização"}
        </Button>
        
        {endereco && (
          <Text>
            Endereço Amproximado: {endereco}
          </Text>
        )}
        {erroLocalizacao && (
          <Text>{erroLocalizacao}</Text>
        )}

        <InputText
          name="descricao"
          label="Descrição"
          multiline
          numberOfLines={5}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Ocorrência perigosa</Text>

          <Controller
            control={control}
            name="perigosa"
            render={({ field }) => (
              <Switch
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </View>

        <Button
          mode="contained"
          onPress={form.handleSubmit(onSubmit)}
        >
          Registrar ocorrência
        </Button>

        <Snackbar
          visible={mensagemVisivel}
          onDismiss={() => setMensagemVisivel(false)}
          duration={3000}
        >
          {mensagem}
        </Snackbar>
      </View>
    </FormProvider>
  );
}