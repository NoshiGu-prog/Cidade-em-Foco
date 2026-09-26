import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Chip, Searchbar, Text } from "react-native-paper";
import { ocorrenciasMock } from "../components/mock";
import { colors } from "../theme/theme";
import type { OcorrenciaType, StatusOcorrencia } from "../types/ocorrencia";

const statusLabels: Record<StatusOcorrencia, string> = {
  ENVIADA: "Enviada",
  EM_ANALISE: "Em análise",
  EM_ANDAMENTO: "Em andamento",
  RESOLVIDA: "Resolvida",
};

const filtros: (StatusOcorrencia | "TODAS")[] = [
  "TODAS",
  "ENVIADA",
  "EM_ANALISE",
  "EM_ANDAMENTO",
  "RESOLVIDA",
];

function OcorrenciaCard({ item }: { item: OcorrenciaType }) {
  const data = new Date(item.criadaEm);

  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Cover source={{ uri: item.imagem }} style={styles.image} />
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.address}>
            {item.endereco}
          </Text>
          {item.perigosa && <Text style={styles.danger}>Perigosa</Text>}
        </View>
        <Text variant="bodyMedium">{item.descricao}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.status}>{statusLabels[item.status]}</Text>
          <Text variant="bodySmall">
            {Number.isNaN(data.getTime())
              ? "Data indisponível"
              : data.toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

export function ListaOcorrenciasScreen() {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<StatusOcorrencia | "TODAS">("TODAS");

  const ocorrencias = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return ocorrenciasMock
      .filter(
        (item) =>
          (status === "TODAS" || item.status === status) &&
          (!termo ||
            `${item.descricao} ${item.endereco}`
              .toLocaleLowerCase("pt-BR")
              .includes(termo)),
      )
      .sort(
        (a, b) =>
          new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime(),
      );
  }, [busca, status]);

  return (
    <View style={styles.page}>
      <FlatList
        data={ocorrencias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OcorrenciaCard item={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Ocorrências
            </Text>
            <Text variant="bodyMedium">
              Acompanhe os problemas registrados na cidade.
            </Text>
            <Searchbar
              placeholder="Buscar por descrição ou endereço"
              value={busca}
              onChangeText={setBusca}
              style={styles.search}
              accessibilityLabel="Buscar ocorrências"
            />
            <View style={styles.filters}>
              {filtros.map((filtro) => (
                <Chip
                  key={filtro}
                  selected={status === filtro}
                  onPress={() => setStatus(filtro)}
                  compact
                >
                  {filtro === "TODAS" ? "Todas" : statusLabels[filtro]}
                </Chip>
              ))}
            </View>
            <Text variant="bodySmall">
              {ocorrencias.length} {ocorrencias.length === 1 ? "ocorrência" : "ocorrências"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma ocorrência encontrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingBottom: 32, gap: 16, maxWidth: 720, width: "100%", alignSelf: "center" },
  header: { gap: 14, marginBottom: 4 },
  title: { color: colors.brandBlue, fontWeight: "bold" },
  search: { backgroundColor: "white" },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  card: { backgroundColor: "white" },
  image: { height: 150 },
  cardContent: { gap: 10, paddingTop: 14, paddingBottom: 16 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", gap: 8, alignItems: "flex-start" },
  address: { color: colors.brandBlue, fontWeight: "bold", flex: 1 },
  danger: { color: "#b3261e", fontWeight: "bold" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  status: { color: colors.brandGreen, fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 32 },
});
