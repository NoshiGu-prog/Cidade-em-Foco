import { Bell, Map, Newspaper, Plus, UserRound } from "lucide-react-native";
import * as React from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation, Text } from "react-native-paper";
import { FeedMapaScreen } from "../screens/FeedMapaScreen";
import { RegistroOcorrenciaScreen } from "../screens/RegistroOcorrenciaScreen";
import { colors } from "../theme/theme";

const PerfilScreen = () => <Text>Perfil</Text>;

export const MenuBar = () => {
  const [index, setIndex] = React.useState(0);

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
      key: "inicio",
      title: "Início",
      focusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Bell color={color} size={size + 6} />
      ),
      unfocusedIcon: ({ color, size }: { color: string; size: number }) => (
        <Bell color={color} size={size} />
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

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "feed":
        return <FeedMapaScreen />;
      case "mapa":
        return <FeedMapaScreen />;
      case "registrar":
        return <RegistroOcorrenciaScreen />;
      case "inicio":
        return <FeedMapaScreen />;
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
      navigationState={{ index, routes }}
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
