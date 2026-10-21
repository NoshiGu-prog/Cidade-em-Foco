import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Searchbar, Text } from "react-native-paper";
import { ocorrenciasMock } from "../components/mock";
import { obterStatusAtual } from "../services/historicoStatus";
import {
  assinarAtualizacoesOcorrencias,
  carregarOcorrencias,
} from "../services/ocorrenciasStorage";
import { colors } from "../theme/theme";
import type {
  OcorrenciaType,
  StatusOcorrencia,
} from "../types/ocorrencia";

const etapas: {
  status: StatusOcorrencia;
  label: string;
  descricao: string;
}[] = [
  {
    status: "ENVIADA",
    label: "Enviada",
    descricao: "A ocorrência foi registrada com sucesso.",
  },
  {
    status: "EM_ANALISE",
    label: "Em análise",
    descricao: "A ocorrência está sendo analisada.",
  },
  {
    status: "EM_ANDAMENTO",
    label: "Em andamento",
    descricao: "O atendimento da ocorrência está em andamento.",
  },
  {
    status: "RESOLVIDA",
    label: "Resolvida",
    descricao: "A ocorrência foi marcada como resolvida.",
  },
];

function mesclarOcorrencias(
  ocorrenciasBase: OcorrenciaType[],
  ocorrenciasSalvas: OcorrenciaType[],
): OcorrenciaType[] {
  const porId = new Map<string, OcorrenciaType>();

  ocorrenciasBase.forEach((ocorrencia) => {
    porId.set(ocorrencia.id, ocorrencia);
  });

  ocorrenciasSalvas.forEach((ocorrencia) => {
    porId.set(ocorrencia.id, ocorrencia);
  });

  return Array.from(porId.values());
}

function AcompanhamentoCard({ item }: { item: OcorrenciaType }) {
  const statusAtual = obterStatusAtual(item);

  const indiceAtual = etapas.findIndex(
    (etapa) => etapa.status === statusAtual,
  );

  const ultimaAlteracao = [...(item.historicoStatus ?? [])]
    .sort(
      (a, b) =>
        new Date(b.alteradoEm).getTime() -
        new Date(a.alteradoEm).getTime(),
    )[0];

  return (
    <Card mode="elevated" style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={styles.endereco}>
          {item.endereco}
        </Text>

        <Text variant="bodyMedium">{item.descricao}</Text>

        <View style={styles.statusAtual}>
          <Text variant="labelMedium">Status atual</Text>

          <Text variant="titleMedium" style={styles.statusAtualTexto}>
            {etapas[indiceAtual]?.label ?? "Status indisponível"}
          </Text>
        </View>

        <View style={styles.etapas}>
          {etapas.map((etapa, index) => {
            const concluida = index < indiceAtual;
            const atual = index === indiceAtual;

            return (
              <View key={etapa.status} style={styles.etapa}>
                <View style={styles.etapaMarcadorArea}>
                  <View
                    style={[
                      styles.marcador,
                      concluida && styles.marcadorConcluido,
                      atual && styles.marcadorAtual,
                    ]}
                  >
                    <Text style={styles.marcadorTexto}>
                      {concluida ? "✓" : atual ? "●" : ""}
                    </Text>
                  </View>

                  {index < etapas.length - 1 && (
                    <View
                      style={[
                        styles.linha,
                        index < indiceAtual && styles.linhaConcluida,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.etapaTexto}>
                  <Text
                    variant="titleSmall"
                    style={[
                      styles.etapaTitulo,
                      (concluida || atual) && styles.etapaAtiva,
                    ]}
                  >
                    {etapa.label}
                  </Text>

                  <Text variant="bodySmall" style={styles.etapaDescricao}>
                    {etapa.descricao}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {ultimaAlteracao && (
          <Text variant="bodySmall" style={styles.ultimaAtualizacao}>
            Última atualização:{" "}
            {new Date(ultimaAlteracao.alteradoEm).toLocaleString("pt-BR")}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

export function AcompanhamentoStatusScreen({
  ocorrencias: ocorrenciasRecebidas = ocorrenciasMock,
}: {
  ocorrencias?: OcorrenciaType[];
}) {
  const [busca, setBusca] = useState("");
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaType[]>(
    ocorrenciasRecebidas,
  );

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const salvas = await carregarOcorrencias();

        if (ativo && salvas) {
          setOcorrencias(
            mesclarOcorrencias(ocorrenciasRecebidas, salvas),
          );
        }
      } catch (erro) {
        console.log(
          "Erro ao carregar ocorrências para acompanhamento:",
          erro,
        );
      }
    }

    const cancelarAssinatura =
      assinarAtualizacoesOcorrencias((novasOcorrencias) => {
        if (ativo) {
          setOcorrencias(
            mesclarOcorrencias(
              ocorrenciasRecebidas,
              novasOcorrencias,
            ),
          );
        }
      });

    void carregar();

    return () => {
      ativo = false;
      cancelarAssinatura();
    };
  }, [ocorrenciasRecebidas]);

  const ocorrenciasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    if (!termo) {
      return ocorrencias;
    }

    return ocorrencias.filter((ocorrencia) =>
      `${ocorrencia.descricao} ${ocorrencia.endereco}`
        .toLocaleLowerCase("pt-BR")
        .includes(termo),
    );
  }, [busca, ocorrencias]);

  return (
    <View style={styles.page}>
      <FlatList
        data={ocorrenciasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AcompanhamentoCard item={item} />
        )}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.titulo}>
              Acompanhamento
            </Text>

            <Text variant="bodyMedium">
              Consulte o andamento das ocorrências registradas.
            </Text>

            <Searchbar
              placeholder="Buscar ocorrência"
              value={busca}
              onChangeText={setBusca}
              style={styles.busca}
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhuma ocorrência encontrada.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lista: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    gap: 12,
    marginBottom: 4,
  },
  titulo: {
    color: colors.brandBlue,
    fontWeight: "bold",
  },
  busca: {
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "white",
  },
  cardContent: {
    gap: 14,
  },
  endereco: {
    color: colors.brandBlue,
    fontWeight: "bold",
  },
  statusAtual: {
    backgroundColor: "#f2f7f7",
    padding: 12,
    borderRadius: 10,
    gap: 2,
  },
  statusAtualTexto: {
    color: colors.brandGreen,
    fontWeight: "bold",
  },
  etapas: {
    gap: 0,
  },
  etapa: {
    flexDirection: "row",
    minHeight: 70,
  },
  etapaMarcadorArea: {
    width: 32,
    alignItems: "center",
  },
  marcador: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#b7b7b7",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  marcadorConcluido: {
    borderColor: colors.brandGreen,
    backgroundColor: colors.brandGreen,
  },
  marcadorAtual: {
    borderColor: colors.brandBlue,
    backgroundColor: colors.brandBlue,
  },
  marcadorTexto: {
    color: "white",
    fontWeight: "bold",
  },
  linha: {
    width: 2,
    flex: 1,
    backgroundColor: "#d5d5d5",
  },
  linhaConcluida: {
    backgroundColor: colors.brandGreen,
  },
  etapaTexto: {
    flex: 1,
    paddingLeft: 8,
    paddingBottom: 14,
  },
  etapaTitulo: {
    color: "#777",
    fontWeight: "bold",
  },
  etapaAtiva: {
    color: colors.brandBlue,
  },
  etapaDescricao: {
    color: "#666",
    marginTop: 2,
  },
  ultimaAtualizacao: {
    color: "#5f6368",
    marginTop: 4,
  },
  vazio: {
    textAlign: "center",
    marginTop: 32,
  },
});