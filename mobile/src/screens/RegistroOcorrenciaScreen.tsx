import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";
import { InputText } from "../components/inputs/TextInput";
import {
  ocorrenciaSchema,
  type OcorrenciaFormData,
} from "../validation/schemas";

export function RegistroOcorrenciaScreen() {
  const form = useForm<OcorrenciaFormData>({
    resolver: zodResolver(ocorrenciaSchema),
    defaultValues: { descricao: "", perigosa: false },
  });
  const { control } = form;

  const onSubmit = (data: OcorrenciaFormData) => {
    console.log("Ocorrência válida", data);
  };

  return (
    <FormProvider {...form}>
      <View style={{ flex: 1, padding: 24, gap: 16 }}>
        <Text variant="headlineMedium">Nova ocorrência</Text>

        <Button mode="outlined" icon="camera" onPress={() => {}}>
          Adicionar foto
        </Button>

        <Button mode="outlined" icon="map-marker" onPress={() => {}}>
          Obter localização
        </Button>

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
              <Switch value={field.value} onValueChange={field.onChange} />
            )}
          />
        </View>

        <Button mode="contained" onPress={form.handleSubmit(onSubmit)}>
          Registrar ocorrência
        </Button>
      </View>
    </FormProvider>
  );
}
