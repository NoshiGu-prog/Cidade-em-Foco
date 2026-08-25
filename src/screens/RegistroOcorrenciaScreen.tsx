import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Image, View } from "react-native";
import { Button, Snackbar, Switch, Text } from "react-native-paper";
import { InputText } from "../components/inputs/TextInput";
import {
  ocorrenciaSchema,
  type OcorrenciaFormData,
} from "../validation/schemas";

export function RegistroOcorrenciaScreen() {
  const [mensagemVisivel, setMensagemVisivel] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [obtendoLocalizacao, setObtendoLocalizacao] = useState(false);
  const [erroLocalizacao, setErroLocalizacao] = useState<string | null>(null);

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

    setLocalizacao({
      latitude: posicao.coords.latitude,
      longitude: posicao.coords.longitude,
    });
  } catch (erro) {
    console.log("Erro ao obter localização:", erro);
    setErroLocalizacao("Não foi possível obter a localização.");
  } finally {
    setObtendoLocalizacao(false);
  }
};

  const onSubmit = (data: OcorrenciaFormData) => {
    console.log("Ocorrência válida", {
      ...data,
      fotoUri,
      latitude: localizacao?.latitude ?? null,
      longitude: localizacao?.longitude ?? null,
    });

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
        
        {localizacao && (
          <Text>
            Latitude: {localizacao.latitude.toFixed(6)} | Longitude:{" "}
            {localizacao.longitude.toFixed(6)}
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
          Dados da ocorrência validados com sucesso!
        </Snackbar>
      </View>
    </FormProvider>
  );
}