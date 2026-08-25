import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Image, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Camera, MapPin } from "lucide-react-native";
import { colors } from "../theme/theme";
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
    <ScrollView
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Nova ocorrência
          </Text>

          <Text style={styles.subtitle}>
            Informe os dados do problema encontrado.
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Foto da ocorrência
          </Text>

          <Button
            mode="outlined"
            onPress={selecionarFoto}
            icon={({ color, size }) => (
              <Camera color={color} size={size} />
            )}
          >
            {fotoUri ? "Trocar foto" : "Adicionar foto"}
          </Button>

          {fotoUri && (
            <Image
              source={{ uri: fotoUri }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Localização
          </Text>

          <Button
            mode="outlined"
            onPress={obterLocalizacao}
            loading={obtendoLocalizacao}
            disabled={obtendoLocalizacao}
            icon={({ color, size }) => (
              <MapPin color={color} size={size} />
            )}
          >
            {localizacao
              ? "Atualizar localização"
              : "Obter localização"}
          </Button>

          {endereco && (
            <View style={styles.locationCard}>
              <MapPin
                color={colors.brandBlue}
                size={22}
              />

              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>
                  Endereço aproximado
                </Text>

                <Text>
                  {endereco}
                </Text>

                {localizacao && (
                  <Text style={styles.coordinates}>
                    {localizacao.latitude.toFixed(6)},{" "}
                    {localizacao.longitude.toFixed(6)}
                  </Text>
                )}
              </View>
            </View>
          )}

          {erroLocalizacao && (
            <Text style={styles.errorText}>
              {erroLocalizacao}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Detalhes
          </Text>

          <InputText
            name="descricao"
            label="Descrição"
            multiline
            numberOfLines={5}
          />

          <View style={styles.dangerRow}>
            <View>
              <Text style={styles.dangerTitle}>
                Ocorrência perigosa
              </Text>

              <Text style={styles.dangerDescription}>
                Marque se houver risco para pessoas ou veículos.
              </Text>
            </View>

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
        </View>

        <Button
          mode="contained"
          onPress={form.handleSubmit(onSubmit)}
          contentStyle={styles.registerButtonContent}
          labelStyle={styles.registerButtonLabel}
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
    </ScrollView>
  </FormProvider>
);
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  container: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    gap: 20,
  },

  header: {
    gap: 4,
  },

  title: {
    color: colors.brandBlue,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#5f6368",
  },

  section: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    gap: 14,
  },

  sectionTitle: {
    color: colors.brandBlue,
    fontWeight: "bold",
  },

  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
  },

  locationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f3f8fc",
  },

  locationText: {
    flex: 1,
    gap: 3,
  },

  locationLabel: {
    color: colors.brandBlue,
    fontWeight: "bold",
  },

  coordinates: {
    fontSize: 12,
    color: "#737373",
  },

  errorText: {
    color: "#b3261e",
  },

  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingTop: 6,
  },

  dangerTitle: {
    fontWeight: "bold",
  },

  dangerDescription: {
    color: "#737373",
    fontSize: 12,
    marginTop: 2,
  },

  registerButtonContent: {
    height: 52,
  },

  registerButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});