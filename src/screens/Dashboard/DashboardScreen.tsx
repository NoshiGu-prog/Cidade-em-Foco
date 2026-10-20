import { useMemo } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Card, Text } from "react-native-paper";
import { Text as SvgText } from "react-native-svg";
import { ocorrenciasMock } from "../../components/mock";
import {
  TIPOS_OCORRENCIA,
  type OcorrenciaType,
  type TipoOcorrencia,
} from "../../types/ocorrencia";
import { dashboardStyles, MetricCard } from "./dashboardLabel";

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
  status: OcorrenciaType["status"],
) {
  return ocorrencias.filter((ocorrencia) => ocorrencia.status === status)
    .length;
}

function formatarDuracao(horas: number) {
  const emDias = horas >= 24;
  const valor = emDias ? horas / 24 : horas;
  const formatado = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
  }).format(valor);

  return `${formatado} ${emDias ? "dias" : "h"}`;
}

export function AdminScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const ocorrencias = ocorrenciasMock;

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
        (alteracao) => alteracao.statusNovo === "RESOLVIDA",
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
    (ocorrencia) => ocorrencia.status !== "RESOLVIDA",
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
    <ScrollView
      style={dashboardStyles.page}
      contentContainerStyle={dashboardStyles.content}
    >
      <View style={dashboardStyles.header}>
        <View>
          <Text variant="headlineMedium" style={dashboardStyles.title}>
            Painel administrativo
          </Text>
          <Text style={dashboardStyles.subtitle}>
            Visão geral dos últimos 30 dias
          </Text>
        </View>
        <Text style={dashboardStyles.period}>ÚLTIMOS 30 DIAS</Text>
      </View>

      <View style={dashboardStyles.metrics}>
        <MetricCard
          label="Registros"
          value={dados.recentes.length}
          tone="blue"
        />
        <MetricCard label="Em aberto" value={totalAbertas} tone="green" />
        <MetricCard label="Com risco" value={totalPerigosas} tone="orange" />
        <MetricCard label="Resolvidos" value={totalResolvidas} tone="teal" />
      </View>

      <Card mode="contained" style={dashboardStyles.chartCard}>
        <Card.Content style={dashboardStyles.chartContent}>
          <View style={dashboardStyles.sectionHeading}>
            <View>
              <Text variant="titleLarge" style={dashboardStyles.sectionTitle}>
                Problemas mais registrados
              </Text>
              <Text style={dashboardStyles.sectionSubtitle}>
                Quantidade por tipo de ocorrência
              </Text>
            </View>
            <Text style={dashboardStyles.totalBadge}>
              {dados.recentes.length} no total
            </Text>
          </View>

          {dados.recentes.length > 0 ? (
            <View style={dashboardStyles.chartScroll}>
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
            <View style={dashboardStyles.emptyState}>
              <Text style={dashboardStyles.emptyTitle}>
                Sem registros neste período
              </Text>
              <Text style={dashboardStyles.emptyText}>
                Os dados por tipo aparecerão aqui quando houver novas
                ocorrências.
              </Text>
            </View>
          )}

          {dados.recentes.length > 0 && (
            <View style={dashboardStyles.legend}>
              {tiposNoGrafico.map((tipo) => (
                <View key={tipo.value} style={dashboardStyles.legendItem}>
                  <View
                    style={[
                      dashboardStyles.legendSwatch,
                      { backgroundColor: tipo.cor },
                    ]}
                  />
                  <Text style={dashboardStyles.legendLabel}>{tipo.label}</Text>
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      <Card mode="contained" style={dashboardStyles.chartCard}>
        <Card.Content style={dashboardStyles.chartContent}>
          <View>
            <Text variant="titleLarge" style={dashboardStyles.sectionTitle}>
              Registros por bairro
            </Text>
            <Text style={dashboardStyles.sectionSubtitle}>
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
                    <View style={dashboardStyles.bairroTopLabel}>
                      <Text
                        style={dashboardStyles.bairroLabel}
                        numberOfLines={2}
                      >
                        {bairro.label}
                      </Text>
                      <Text style={dashboardStyles.bairroTotal}>
                        {bairro.value}{" "}
                        {bairro.value === 1 ? "registro" : "registros"}
                      </Text>
                    </View>
                  ),
                  barInnerComponent: (item) => (
                    <View style={dashboardStyles.barValueContainer}>
                      <Text style={dashboardStyles.barValue}>
                        {item?.value}
                      </Text>
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
                topLabelContainerStyle={dashboardStyles.bairroTopLabelContainer}
              />
            </ScrollView>
          ) : (
            <View style={dashboardStyles.emptyState}>
              <Text style={dashboardStyles.emptyTitle}>
                Sem bairros neste período
              </Text>
              <Text style={dashboardStyles.emptyText}>
                Os registros por bairro aparecerão aqui quando houver novas
                ocorrências.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card mode="contained" style={dashboardStyles.chartCard}>
        <Card.Content style={dashboardStyles.chartContent}>
          <View>
            <Text variant="titleLarge" style={dashboardStyles.sectionTitle}>
              Tempo Médio de Resolução
            </Text>
            <Text style={dashboardStyles.sectionSubtitle}>
              Média entre o registro e a resolução, por tipo de problema
            </Text>
          </View>

          {dados.sla.length > 0 ? (
            <View style={dashboardStyles.slaList}>
              {dados.sla.map((item) => (
                <View key={item.tipo} style={dashboardStyles.slaItem}>
                  <View style={dashboardStyles.slaHeading}>
                    <Text style={dashboardStyles.slaType}>{item.label}</Text>
                    <Text style={dashboardStyles.slaDuration}>
                      {formatarDuracao(item.mediaHoras)}
                    </Text>
                  </View>
                  <View style={dashboardStyles.slaTrack}>
                    <View
                      style={[
                        dashboardStyles.slaBar,
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
                  <Text style={dashboardStyles.slaCount}>
                    Baseado em {item.quantidade}{" "}
                    {item.quantidade === 1
                      ? "ocorrência resolvida"
                      : "ocorrências resolvidas"}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={dashboardStyles.emptyState}>
              <Text style={dashboardStyles.emptyTitle}>
                Ainda não há ocorrências resolvidas
              </Text>
              <Text style={dashboardStyles.emptyText}>
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
