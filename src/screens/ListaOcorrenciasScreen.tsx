// ALTERADO: acrescentados useEffect e useRef.
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Chip, Searchbar, Text } from "react-native-paper";
import { ocorrenciasMock } from "../components/mock";
import {
  atualizarStatusOcorrencia,
  obterStatusAtual,
} from "../services/historicoStatus";

// ACRESCENTADO: funções de armazenamento local.
import {
  carregarOcorrencias,
  salvarOcorrencias,
} from "../services/ocorrenciasStorage";

import { colors } from "../theme/theme";
import type { OcorrenciaType, StatusOcorrencia } from "../types/ocorrencia";

const statusLabels: Record<StatusOcorrencia, string> = {
  ENVIADA: "Enviada",
  EM_ANALISE: "Em análise",
  EM_ANDAMENTO: "Em andamento",
  RESOLVIDA: "Resolvida",
};

const opcoesStatus: StatusOcorrencia[] = [
  "ENVIADA",
  "EM_ANALISE",
  "EM_ANDAMENTO",
  "RESOLVIDA",
];

const filtros: (StatusOcorrencia | "TODAS")[] = ["TODAS", ...opcoesStatus];

function formatarDataHistorico(valor: string | Date): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Data indisponível";
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type OcorrenciaCardProps = {
  item: OcorrenciaType;
  onAlterarStatus: (id: string, novoStatus: StatusOcorrencia) => void;

  // ACRESCENTADO: bloqueia os controles durante o salvamento.
  salvando: boolean;
};

function OcorrenciaCard({
  item,
  onAlterarStatus,
  salvando,
}: OcorrenciaCardProps) {
  const data = new Date(item.criadaEm);
  const statusAtual = obterStatusAtual(item);

  const historico = [...(item.historicoStatus ?? [])].sort(
    (a, b) =>
      new Date(a.alteradoEm).getTime() - new Date(b.alteradoEm).getTime(),
  );

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
          <Text style={styles.status}>{statusLabels[statusAtual]}</Text>

          <Text variant="bodySmall">
            {Number.isNaN(data.getTime())
              ? "Data indisponível"
              : data.toLocaleDateString("pt-BR")}
          </Text>
        </View>

        <View style={styles.statusControl}>
          <Text variant="titleSmall" style={styles.historyTitle}>
            Alterar status — teste
          </Text>

          {/* ALTERADO: informa que as mudanças são salvas localmente. */}
          <Text variant="bodySmall" style={styles.notice}>
            {salvando
              ? "Salvando alteração..."
              : "Alterações salvas neste navegador ou dispositivo."}
          </Text>

          <View style={styles.statusOptions}>
            {opcoesStatus.map((opcao) => (
              <Chip
                key={opcao}
                selected={statusAtual === opcao}
                // ALTERADO: impede novas mudanças durante o salvamento.
                disabled={salvando || statusAtual === opcao}
                onPress={() => onAlterarStatus(item.id, opcao)}
                compact
              >
                {statusLabels[opcao]}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.historySection}>
          <Text variant="titleSmall" style={styles.historyTitle}>
            Histórico de status
          </Text>

          {historico.length === 0 ? (
            <Text variant="bodySmall" style={styles.notice}>
              Nenhum histórico disponível.
            </Text>
          ) : (
            historico.map((registro, index) => (
              <View
                key={`${item.id}-${registro.alteradoEm}-${index}`}
                style={styles.historyItem}
              >
                <Text variant="bodyMedium" style={styles.historyStatus}>
                  {registro.statusAnterior === null
                    ? `Registro inicial: ${statusLabels[registro.novoStatus]}`
                    : `${statusLabels[registro.statusAnterior]} → ${
                        statusLabels[registro.novoStatus]
                      }`}
                </Text>

                <Text variant="bodySmall" style={styles.notice}>
                  {formatarDataHistorico(registro.alteradoEm)}
                </Text>
              </View>
            ))
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

export function ListaOcorrenciasScreen({
  ocorrencias: todasOcorrencias = ocorrenciasMock,
}: {
  ocorrencias?: OcorrenciaType[];
}) {
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<StatusOcorrencia | "TODAS">("TODAS");

  // ALTERADO: a lista será preenchida após consultar o armazenamento.
  const [listaOcorrencias, setListaOcorrencias] = useState<OcorrenciaType[]>(
    [],
  );

  // ACRESCENTADO: estados de carregamento, salvamento e erro.
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [erroSalvamento, setErroSalvamento] = useState<string | null>(null);

  // ACRESCENTADO: bloqueio imediato contra cliques simultâneos.
  const salvamentoEmCurso = useRef(false);

  // ACRESCENTADO: carrega os dados uma vez ao abrir a tela.
  useEffect(() => {
    let ativo = true;

    async function iniciar() {
      try {
        const dadosSalvos = await carregarOcorrencias();

        if (ativo) {
          // Usa os exemplos apenas quando não existem dados salvos.
          setListaOcorrencias(dadosSalvos ?? ocorrenciasMock);
        }
      } catch {
        if (ativo) {
          // Não substitui dados salvos quando ocorre erro de leitura.
          setErroCarregamento(
            "Não foi possível carregar as ocorrências. Reabra a tela para tentar novamente.",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void iniciar();

    // Evita atualizar o estado caso a tela seja desmontada.
    return () => {
      ativo = false;
    };
  }, []);

  // ALTERADO: salva a lista antes de atualizar o cartão.
  const alterarStatus = async (
    id: string,
    novoStatus: StatusOcorrencia,
  ): Promise<void> => {
    if (carregando || erroCarregamento || salvamentoEmCurso.current) {
      return;
    }

    const ocorrenciaAtual = listaOcorrencias.find((item) => item.id === id);

    if (!ocorrenciaAtual || obterStatusAtual(ocorrenciaAtual) === novoStatus) {
      return;
    }

    salvamentoEmCurso.current = true;
    setSalvando(true);
    setErroSalvamento(null);

    try {
      const novaLista = listaOcorrencias.map((ocorrencia) =>
        ocorrencia.id === id
          ? atualizarStatusOcorrencia(ocorrencia, novoStatus)
          : ocorrencia,
      );

      await salvarOcorrencias(novaLista);
      setListaOcorrencias(novaLista);
    } catch {
      // Mantém o status anterior caso o salvamento falhe.
      setErroSalvamento(
        "Não foi possível salvar a alteração. O status foi mantido. Tente novamente.",
      );
    } finally {
      salvamentoEmCurso.current = false;
      setSalvando(false);
    }
  };

  const ocorrencias = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return listaOcorrencias
      .filter(
        (item) =>
          (status === "TODAS" || obterStatusAtual(item) === status) &&
          (!termo ||
            `${item.descricao} ${item.endereco}`
              .toLocaleLowerCase("pt-BR")
              .includes(termo)),
      )
      .sort(
        (a, b) =>
          new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime(),
      );
  }, [busca, status, listaOcorrencias]);

  // ACRESCENTADO: aguarda a leitura antes de exibir os controles.
  if (carregando) {
    return (
      <View style={styles.centered}>
        <Text>Carregando ocorrências...</Text>
      </View>
    );
  }

  // ACRESCENTADO: bloqueia alterações caso a leitura tenha falhado.
  if (erroCarregamento) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{erroCarregamento}</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={ocorrencias}
        // ACRESCENTADO: atualiza os cartões quando o salvamento muda.
        extraData={salvando}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OcorrenciaCard
            item={item}
            salvando={salvando}
            onAlterarStatus={(id, novoStatus) => {
              void alterarStatus(id, novoStatus);
            }}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Ocorrências
            </Text>

            <Text variant="bodyMedium">
              Acompanhe os problemas registrados na cidade.
            </Text>

            {/* ACRESCENTADO: apresenta falhas de salvamento. */}
            {erroSalvamento && (
              <Text style={styles.error} accessibilityRole="alert">
                {erroSalvamento}
              </Text>
            )}

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
              {ocorrencias.length}{" "}
              {ocorrencias.length === 1 ? "ocorrência" : "ocorrências"}
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
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ACRESCENTADO: apresentação do carregamento e erro de leitura.
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  error: {
    color: "#b3261e",
  },

  list: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    gap: 14,
    marginBottom: 4,
  },
  title: {
    color: colors.brandBlue,
    fontWeight: "bold",
  },
  search: {
    backgroundColor: "white",
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  card: {
    backgroundColor: "white",
  },
  image: {
    height: 150,
  },
  cardContent: {
    gap: 10,
    paddingTop: 14,
    paddingBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "flex-start",
  },
  address: {
    color: colors.brandBlue,
    fontWeight: "bold",
    flex: 1,
  },
  danger: {
    color: "#b3261e",
    fontWeight: "bold",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  status: {
    color: colors.brandGreen,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 32,
  },
  statusControl: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 8,
  },
  statusOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  // ALTERADO: estilo compartilhado pelos textos auxiliares.
  notice: {
    color: "#5f6368",
  },

  historySection: {
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 10,
  },
  historyTitle: {
    color: colors.brandBlue,
    fontWeight: "bold",
  },
  historyItem: {
    borderLeftWidth: 3,
    borderLeftColor: colors.brandBlue,
    paddingLeft: 10,
    paddingVertical: 4,
    gap: 4,
  },
  historyStatus: {
    fontWeight: "bold",
  },
});
