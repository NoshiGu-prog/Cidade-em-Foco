import {
  Bell,
  ChartColumnIncreasing,
  Map,
  Newspaper,
  Plus,
  UserRound,
} from "lucide-react-native";
import * as React from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation, Text } from "react-native-paper";
import { FeedMapaScreen } from "../screens/FeedMapa/FeedMapaScreen";
// Mere Helen: importa a nova tela de lista de ocorrências.
import { DashboardScreen } from "../screens/Dashboard/DashboardScreen";
import { ListaOcorrenciasScreen } from "../screens/ListaOcorrenciasScreen";
import { RegistroOcorrenciaScreen } from "../screens/RegistroOcorrenciaScreen";
import { colors } from "../theme/theme";
import type { OcorrenciaType } from "../types/ocorrencia";
import { RouteType } from "../types/routes";
import { ocorrenciasMock } from "./mock";
import { AcompanhamentoStatusScreen } from "../screens/AcompanhamentoStatusScreen";

const PerfilScreen = () => <Text>Perfil</Text>;

export const MenuBar = () => {
  const [index, setIndex] = React.useState(0);
  const [ocorrencias, setOcorrencias] = React.useState(ocorrenciasMock);

  const adicionarOcorrencia = (ocorrencia: OcorrenciaType) => {
    setOcorrencias((atuais) => [ocorrencia, ...atuais]);
  };

  const routes = [
    {
      key: "feed",
      title: "Feed",
      focusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Newspaper color={color} size={size + 6} />
      ),
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Newspaper color={color} size={size} />
      ),
    },
    {
      key: "mapa",
      title: "Mapa",
      focusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Map color={color} size={size + 6} />
      ),
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Map color={color} size={size} />
      ),
    },
    {
      key: "registrar",
      title: "Registrar",
      focusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Plus color={color} size={size + 6} />
      ),
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Plus color={color} size={size} />
      ),
    },
    {
      key: "notifications",
      title: "Status",
      focusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Bell color={color} size={size + 6} />
      ),
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Bell color={color} size={size} />
      ),
    },
    {
      key: "dashboard",
      title: "Dashboard",
      focusedIcon: ({ color, size }: { color: string; size: number }) => (
        <ChartColumnIncreasing color={color} size={size + 6} />
      ),
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => (
        <ChartColumnIncreasing color={color} size={size} />
      ),
    },
    {
      key: "perfil",
      title: "Perfil",
      focusedIcon: ({ color, size }: { color: string; size: number }) => (
        <UserRound color={color} size={size + 6} />
      ),
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => (
        <UserRound color={color} size={size} />
      ),
    },
  ];

  const renderScene = ({ route }: { route: { key: RouteType } }) => {
    switch (route.key) {
      case "feed":
        // Mere Helen: o Feed agora mostra a lista de ocorrências.
        return <ListaOcorrenciasScreen ocorrencias={ocorrencias} />;
      case "mapa":
        return <FeedMapaScreen />;
      case "registrar":
        return <RegistroOcorrenciaScreen onRegister={adicionarOcorrencia} />;
      case "notifications":
        return (
              <AcompanhamentoStatusScreen ocorrencias={ocorrencias} />
       );
      case "dashboard":
        return <DashboardScreen />;
      case "perfil":
        return <PerfilScreen />;
      default:
        return <FeedMapaScreen />;
    }
  };

  return (
    <BottomNavigation
      theme={{
        colors: {
          secondaryContainer: "transparent",
          onSecondaryContainer: "white",
        },
      }}
      barStyle={styles.bottomBar}
      navigationState={{ index, routes: routes as never }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: colors.brandBlue,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default MenuBar;
