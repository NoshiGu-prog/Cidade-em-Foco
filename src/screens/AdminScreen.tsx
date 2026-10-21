import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Card, Text } from "react-native-paper";
import { Text as SvgText } from "react-native-svg";
import { obterStatusAtual } from "../services/historicoStatus";
import { colors } from "../theme/theme";
import {
  TIPOS_OCORRENCIA,
  type OcorrenciaType,
  type TipoOcorrencia,
} from "../types/ocorrencia";

const coresTipos = [
  "#2a62a2",
  "#50924d",
  "#d28a28",
  "#168b89",
  "#ba5d48",
  "#776543",
  "#507b9e",
  "#82934d",
];

function extrairBairro(endereco: string) {
  const enderecoNormalizado = endereco.trim();
  const partesComTraco = enderecoNormalizado.split(" - ");

  if (partesComTraco.length > 1) {
    return partesComTraco[partesComTraco.length - 1].trim();
  }

  const partesPorVirgula = enderecoNormalizado
    .split(",")
    .map((parte) => parte.trim())
    .filter(Boolean);

  return partesPorVirgula.length >= 3
    ? partesPorVirgula[partesPorVirgula.length - 2]
    : "Não informado";
}

function contarStatus(
  ocorrencias: OcorrenciaType[],
  status: import("../types/ocorrencia").StatusOcorrencia,
) {
  return ocorrencias.filter(
    (ocorrencia) => obterStatusAtual(ocorrencia) === status,
  ).length;
}

function formatarDuracao(horas: number) {
  const emDias = horas >= 24;
  const valor = emDias ? horas / 24 : horas;
  const formatado = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
  }).format(valor);

  return `${formatado} ${emDias ? "dias" : "h"}`;
}

export function AdminScreen({
  ocorrencias,
}: {
  ocorrencias: OcorrenciaType[];
}) {
  const { width: windowWidth } = useWindowDimensions();

  const dados = useMemo(() => {
    const agora = new Date();
    const inicioPeriodo = new Date(agora);
    inicioPeriodo.setDate(inicioPeriodo.getDate() - 29);
    inicioPeriodo.setHours(0, 0, 0, 0);

    const recentes = ocorrencias.filter((ocorrencia) => {
      const criadaEm = new Date(ocorrencia.criadaEm).getTime();
      return criadaEm >= inicioPeriodo.getTime() && criadaEm <= agora.getTime();
    });

    const contagemPorTipo = new Map<TipoOcorrencia, number>(
      TIPOS_OCORRENCIA.map(({ value }) => [value, 0]),
    );

    recentes.forEach((ocorrencia) => {
      contagemPorTipo.set(
        ocorrencia.tipo,
        (contagemPorTipo.get(ocorrencia.tipo) ?? 0) + 1,
      );
    });

    const contagemPorBairro = new Map<string, number>();
    recentes.forEach((ocorrencia) => {
      const bairro = extrairBairro(ocorrencia.endereco);
      contagemPorBairro.set(bairro, (contagemPorBairro.get(bairro) ?? 0) + 1);
    });

    const temposPorTipo = new Map<
      TipoOcorrencia,
      { totalHoras: number; quantidade: number }
    >();
    recentes.forEach((ocorrencia) => {
      const resolucao = ocorrencia.historicoStatus.find(
        (alteracao) => alteracao.novoStatus === "RESOLVIDA",
      );
      if (!resolucao) return;

      const criadaEm = new Date(ocorrencia.criadaEm).getTime();
      const resolvidaEm = new Date(resolucao.alteradoEm).getTime();
      const duracaoHoras = (resolvidaEm - criadaEm) / (1000 * 60 * 60);
      if (!Number.isFinite(duracaoHoras) || duracaoHoras < 0) return;

      const acumulado = temposPorTipo.get(ocorrencia.tipo) ?? {
        totalHoras: 0,
        quantidade: 0,
      };
      temposPorTipo.set(ocorrencia.tipo, {
        totalHoras: acumulado.totalHoras + duracaoHoras,
        quantidade: acumulado.quantidade + 1,
      });
    });

    return {
      recentes,
      tipos: TIPOS_OCORRENCIA.map((tipo, index) => ({
        ...tipo,
        quantidade: contagemPorTipo.get(tipo.value) ?? 0,
        cor: coresTipos[index],
      })).sort((a, b) => b.quantidade - a.quantidade),
      bairros: Array.from(contagemPorBairro, ([bairro, quantidade]) => ({
        label: bairro,
        value: quantidade,
      })).sort((a, b) => b.value - a.value),
      sla: TIPOS_OCORRENCIA.map((tipo, index) => {
        const acumulado = temposPorTipo.get(tipo.value);

        return acumulado
          ? {
              tipo: tipo.value,
              label: tipo.label,
              mediaHoras: acumulado.totalHoras / acumulado.quantidade,
              quantidade: acumulado.quantidade,
              cor: coresTipos[index],
            }
          : null;
      })
        .filter((item) => item !== null)
        .sort((a, b) => b.mediaHoras - a.mediaHoras),
    };
  }, [ocorrencias]);

  const totalAbertas = dados.recentes.filter(
    (ocorrencia) => obterStatusAtual(ocorrencia) !== "RESOLVIDA",
  ).length;
  const totalPerigosas = dados.recentes.filter(
    (ocorrencia) => ocorrencia.perigosa,
  ).length;
  const totalResolvidas = contarStatus(dados.recentes, "RESOLVIDA");
  const chartRadius = Math.min(150, Math.max(90, (windowWidth - 100) / 2));
  const tiposNoGrafico = dados.tipos.filter((tipo) => tipo.quantidade > 0);
  const bairrosChartWidth = Math.max(
    windowWidth - 80,
    dados.bairros.length * 84,
  );
  const maiorSlaHoras = Math.max(
    1,
    ...dados.sla.map((item) => item.mediaHoras),
  );
  const chartData = tiposNoGrafico.map((tipo) => ({
    value: tipo.quantidade,
    color: tipo.cor,
    text: `${tipo.quantidade} · ${Math.round(
      (tipo.quantidade / dados.recentes.length) * 100,
    )}%`,
  }));

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text variant="headlineMedium" style={styles.title}>
            Painel administrativo
          </Text>
          <Text style={styles.subtitle}>Visão geral dos últimos 30 dias</Text>
        </View>
        <Text style={styles.period}>ÚLTIMOS 30 DIAS</Text>
      </View>

      <View style={styles.metrics}>
        <MetricCard
          label="Registros"
          value={dados.recentes.length}
          tone="blue"
        />
        <MetricCard label="Em aberto" value={totalAbertas} tone="green" />
        <MetricCard label="Com risco" value={totalPerigosas} tone="orange" />
        <MetricCard label="Resolvidos" value={totalResolvidas} tone="teal" />
      </View>

      <Card mode="contained" style={styles.chartCard}>
        <Card.Content style={styles.chartContent}>
          <View style={styles.sectionHeading}>
            <View>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Problemas mais registrados
              </Text>
              <Text style={styles.sectionSubtitle}>
                Quantidade por tipo de ocorrência
              </Text>
            </View>
            <Text style={styles.totalBadge}>
              {dados.recentes.length} no total
            </Text>
          </View>

          {dados.recentes.length > 0 ? (
            <View style={styles.chartScroll}>
              <PieChart
                data={chartData}
                radius={chartRadius}
                isAnimated
                donut
                pieInnerComponent={(item) => (
                  <SvgText
                    x={0}
                    y={5}
                    fill="white"
                    fontSize={18}
                    fontWeight="700"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {item?.text}
                  </SvgText>
                )}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Sem registros neste período</Text>
              <Text style={styles.emptyText}>
                Os dados por tipo aparecerão aqui quando houver novas
                ocorrências.
              </Text>
            </View>
          )}

          {dados.recentes.length > 0 && (
            <View style={styles.legend}>
              {tiposNoGrafico.map((tipo) => (
                <View key={tipo.value} style={styles.legendItem}>
                  <View
                    style={[styles.legendSwatch, { backgroundColor: tipo.cor }]}
                  />
                  <Text style={styles.legendLabel}>{tipo.label}</Text>
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      <Card mode="contained" style={styles.chartCard}>
        <Card.Content style={styles.chartContent}>
          <View>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Registros por bairro
            </Text>
            <Text style={styles.sectionSubtitle}>
              Ocorrências agrupadas por bairro nos últimos 30 dias
            </Text>
          </View>

          {dados.bairros.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <BarChart
                data={dados.bairros.map((bairro, index) => ({
                  ...bairro,
                  label: "",
                  frontColor: coresTipos[index % coresTipos.length],
                  topLabelComponent: () => (
                    <View style={styles.bairroTopLabel}>
                      <Text style={styles.bairroLabel} numberOfLines={2}>
                        {bairro.label}
                      </Text>
                      <Text style={styles.bairroTotal}>
                        {bairro.value}{" "}
                        {bairro.value === 1 ? "registro" : "registros"}
                      </Text>
                    </View>
                  ),
                  barInnerComponent: (item) => (
                    <View style={styles.barValueContainer}>
                      <Text style={styles.barValue}>{item?.value}</Text>
                    </View>
                  ),
                }))}
                width={bairrosChartWidth}
                height={250}
                barWidth={48}
                spacing={36}
                initialSpacing={0}
                noOfSections={2}
                maxValue={Math.ceil(
                  Math.max(...dados.bairros.map((bairro) => bairro.value)) *
                    1.25,
                )}
                minHeight={36}
                hideRules
                xAxisLabelsHeight={0}
                xAxisThickness={1}
                yAxisThickness={0}
                isAnimated
                yAxisLabelWidth={0}
                topLabelContainerStyle={styles.bairroTopLabelContainer}
              />
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Sem bairros neste período</Text>
              <Text style={styles.emptyText}>
                Os registros por bairro aparecerão aqui quando houver novas
                ocorrências.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card mode="contained" style={styles.chartCard}>
        <Card.Content style={styles.chartContent}>
          <View>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              3. Tempo Médio de Resolução (SLA de Atendimento)
            </Text>
            <Text style={styles.sectionSubtitle}>
              Média entre o registro e a resolução, por tipo de problema
            </Text>
          </View>

          {dados.sla.length > 0 ? (
            <View style={styles.slaList}>
              {dados.sla.map((item) => (
                <View key={item.tipo} style={styles.slaItem}>
                  <View style={styles.slaHeading}>
                    <Text style={styles.slaType}>{item.label}</Text>
                    <Text style={styles.slaDuration}>
                      {formatarDuracao(item.mediaHoras)}
                    </Text>
                  </View>
                  <View style={styles.slaTrack}>
                    <View
                      style={[
                        styles.slaBar,
                        {
                          width: `${Math.max(
                            6,
                            (item.mediaHoras / maiorSlaHoras) * 100,
                          )}%`,
                          backgroundColor: item.cor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.slaCount}>
                    Baseado em {item.quantidade}{" "}
                    {item.quantidade === 1
                      ? "ocorrência resolvida"
                      : "ocorrências resolvidas"}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                Ainda não há ocorrências resolvidas
              </Text>
              <Text style={styles.emptyText}>
                O SLA será calculado quando houver transições para resolvida
                registradas no histórico.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "green" | "orange" | "teal";
}) {
  return (
    <Card mode="contained" style={[styles.metricCard, styles[`metric${tone}`]]}>
      <Card.Content style={styles.metricContent}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricLabel}>{label}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 20,
    maxWidth: 920,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: { color: colors.brandBlue, fontWeight: "bold" },
  subtitle: { color: "#5f6368", marginTop: 4 },
  period: {
    color: colors.brandGreen,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metricCard: { flexGrow: 1, flexBasis: "45%", borderRadius: 8 },
  metricblue: { backgroundColor: "#dce8f3" },
  metricgreen: { backgroundColor: "#e1eddf" },
  metricorange: { backgroundColor: "#f5e9d7" },
  metricteal: { backgroundColor: "#dceceb" },
  metricContent: { minHeight: 94, justifyContent: "center", gap: 5 },
  metricValue: { color: "#183f5c", fontSize: 28, fontWeight: "bold" },
  metricLabel: { color: "#505b63", fontSize: 13 },
  chartCard: { backgroundColor: "#ffffff", borderRadius: 8 },
  chartContent: { padding: 18, gap: 18 },
  sectionHeading: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: { color: "#243d4d", fontWeight: "bold" },
  sectionSubtitle: { color: "#6d777d", marginTop: 3 },
  totalBadge: {
    color: colors.brandBlue,
    backgroundColor: "#edf3f8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "bold",
  },
  chartScroll: { alignItems: "center", justifyContent: "center" },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 20,
    rowGap: 12,
    borderTopWidth: 1,
    borderTopColor: "#e6ebed",
    paddingTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexBasis: "45%",
    flexGrow: 1,
    minWidth: 0,
  },
  legendSwatch: { width: 10, height: 10, borderRadius: 2 },
  legendLabel: { color: "#52616a", fontSize: 12, flex: 1 },
  bairroTopLabelContainer: {
    left: -15,
    width: 78,
    height: 42,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bairroLabel: {
    width: 78,
    color: "#344b58",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  bairroTopLabel: {
    width: 78,
    alignItems: "center",
    gap: 2,
  },
  bairroTotal: {
    color: colors.brandBlue,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  barValueContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  barValue: {
    minWidth: 24,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    color: "#183f5c",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 5,
    paddingVertical: 2,
    textAlign: "center",
  },
  slaList: { gap: 18 },
  slaItem: { gap: 7 },
  slaHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  slaType: { color: "#344b58", fontSize: 13, fontWeight: "600", flex: 1 },
  slaDuration: { color: colors.brandBlue, fontSize: 14, fontWeight: "bold" },
  slaTrack: {
    height: 10,
    backgroundColor: "#e8eef1",
    borderRadius: 5,
    overflow: "hidden",
  },
  slaBar: { height: "100%", borderRadius: 5 },
  slaCount: { color: "#6d777d", fontSize: 11 },
  emptyState: {
    minHeight: 160,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 6,
  },
  emptyTitle: { color: "#344b58", fontWeight: "bold" },
  emptyText: { color: "#6d777d", textAlign: "center" },
});
