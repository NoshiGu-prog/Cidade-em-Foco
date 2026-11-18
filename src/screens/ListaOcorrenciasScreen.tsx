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
import { priorizarNoBackend } from "../services/priorizacaoOcorrencias";
import {
  TIPOS_OCORRENCIA,
  type OcorrenciaType,
  type OcorrenciaPrioritizada,
  type PrioridadeOcorrencia,
  type StatusOcorrencia,
} from "../types/ocorrencia";

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

const coresPrioridade: Record<PrioridadeOcorrencia, string> = {
  CRITICA: "#b3261e",
  ALTA: "#c45a00",
  MEDIA: "#8a6d00",
  BAIXA: "#357a38",
};

const prioridadeLabels: Record<PrioridadeOcorrencia, string> = {
  CRITICA: "Crítica",
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa",
};

const tipoLabels = new Map(
  TIPOS_OCORRENCIA.map((tipo) => [tipo.value, tipo.label]),
);

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
  avaliacao: OcorrenciaPrioritizada;
  onAlterarStatus: (id: string, novoStatus: StatusOcorrencia) => void;

  // ACRESCENTADO: bloqueia os controles durante o salvamento.
  salvando: boolean;
};

function OcorrenciaCard({
  avaliacao,
  onAlterarStatus,
  salvando,
}: OcorrenciaCardProps) {
  const {
    ocorrencia: item,
    prioridade,
    chamadosNaRegiao,
    chamadosPerigosos,
    chamadosRecentes,
  } = avaliacao;
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

          <View style={styles.badges}>
            <Text
              style={[
                styles.priorityIndicator,
                { backgroundColor: coresPrioridade[prioridade] },
              ]}
              accessibilityLabel={`Prioridade ${prioridadeLabels[prioridade]}`}
            >
              {prioridadeLabels[prioridade]}
            </Text>
          </View>
        </View>

        <Text variant="bodySmall" style={styles.notice}>
          {tipoLabels.get(item.tipo) ?? item.tipo} · {chamadosNaRegiao}{" "}
          {chamadosNaRegiao === 1 ? "chamado" : "chamados"} na região ·{" "}
          {chamadosPerigosos}{" "}
          {chamadosPerigosos === 1
            ? "marcado como perigoso"
            : "marcados como perigosos"}{" "}
          · {chamadosRecentes} nos últimos 30 dias
        </Text>

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
  const [listaOcorrencias, setListaOcorrencias] = useState<
    OcorrenciaPrioritizada[]
  >([]);

  // ACRESCENTADO: estados de carregamento, salvamento e erro.
  const [carregando, setCarregando] = useState(true);
  const [carregamentoConcluido, setCarregamentoConcluido] = useState(false);
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
        const dadosBase = dadosSalvos ?? todasOcorrencias;
        const dadosPriorizados = await priorizarNoBackend(dadosBase);

        if (ativo) {
          setListaOcorrencias(dadosPriorizados);
        }
      } catch {
        if (ativo) {
          setErroCarregamento(
            "Não foi possível carregar e priorizar as ocorrências. Verifique o backend e tente novamente.",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
          setCarregamentoConcluido(true);
        }
      }
    }

    void iniciar();

    // Evita atualizar o estado caso a tela seja desmontada.
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!carregamentoConcluido) {
      return;
    }

    let ativo = true;

    async function incluirNovasOcorrencias() {
      const atuais = listaOcorrencias.map(
        ({ ocorrencia }) => ocorrencia,
      );
      const idsAtuais = new Set(atuais.map((ocorrencia) => ocorrencia.id));
      const novasOcorrencias = todasOcorrencias.filter(
        (ocorrencia) => !idsAtuais.has(ocorrencia.id),
      );

      if (novasOcorrencias.length === 0) {
        return;
      }

      try {
        const dadosPriorizados = await priorizarNoBackend([
          ...novasOcorrencias,
          ...atuais,
        ]);

        if (ativo) {
          setListaOcorrencias(dadosPriorizados);
        }
      } catch {
        if (ativo) {
          setErroCarregamento(
            "Não foi possível atualizar a lista priorizada.",
          );
        }
      }
    }

    void incluirNovasOcorrencias();

    return () => {
      ativo = false;
    };
  }, [carregamentoConcluido, todasOcorrencias]);

  // ALTERADO: salva a lista antes de atualizar o cartão.
  const alterarStatus = async (
    id: string,
    novoStatus: StatusOcorrencia,
  ): Promise<void> => {
    if (carregando || erroCarregamento || salvamentoEmCurso.current) {
      return;
    }

    const ocorrenciaAtual = listaOcorrencias.find(
      (item) => item.ocorrencia.id === id,
    )?.ocorrencia;

    if (!ocorrenciaAtual || obterStatusAtual(ocorrenciaAtual) === novoStatus) {
      return;
    }

    salvamentoEmCurso.current = true;
    setSalvando(true);
    setErroSalvamento(null);

    try {
      const novaLista = listaOcorrencias.map(({ ocorrencia }) =>
        ocorrencia.id === id
          ? atualizarStatusOcorrencia(ocorrencia, novoStatus)
          : ocorrencia,
      );

      await salvarOcorrencias(novaLista);
      const dadosPriorizados = await priorizarNoBackend(novaLista);
      setListaOcorrencias(dadosPriorizados);
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

    return listaOcorrencias.filter(
      ({ ocorrencia: item }) =>
        (status === "TODAS" || obterStatusAtual(item) === status) &&
          (!termo ||
            `${item.descricao} ${item.endereco}`
              .toLocaleLowerCase("pt-BR")
              .includes(termo)),
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
        keyExtractor={(item) => item.ocorrencia.id}
        renderItem={({ item: avaliacao }) => (
          <OcorrenciaCard
            avaliacao={avaliacao}
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
  badges: {
    alignItems: "flex-end",
    gap: 4,
  },
  priorityIndicator: {
    minWidth: 58,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  address: {
    color: colors.brandBlue,
    fontWeight: "bold",
    flex: 1,
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
