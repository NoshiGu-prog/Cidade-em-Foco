import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { colors } from "../../theme/theme";

export function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "green" | "orange" | "teal";
}) {
  return (
    <Card
      mode="contained"
      style={[dashboardStyles.metricCard, dashboardStyles[`metric${tone}`]]}
    >
      <Card.Content style={dashboardStyles.metricContent}>
        <Text style={dashboardStyles.metricValue}>{value}</Text>
        <Text style={dashboardStyles.metricLabel}>{label}</Text>
      </Card.Content>
    </Card>
  );
}

export const dashboardStyles = StyleSheet.create({
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
