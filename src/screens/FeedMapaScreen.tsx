import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card, Text } from "react-native-paper";

import MapComponent from "./FeedMapa/map";

interface Ocorrencia {
  id: string;
  titulo: string;
  descricao: string;
  lat: number;
  lng: number;
  data: string;
}

const ocorrenciasMock: Ocorrencia[] = [
  {
    id: "1",
    titulo: "Buraco na Pista",
    descricao: "Rua Ângelo Corso",
    lat: -29.1635,
    lng: -51.1742,
    data: "Hoje às 14:00",
  },
  {
    id: "2",
    titulo: "Poste Apagado",
    descricao: "Rua Padre João Schiavo",
    lat: -29.1661,
    lng: -51.173,
    data: "Ontem",
  },
  {
    id: "3",
    titulo: "Radar Móvel",
    descricao: "Av. Brasil",
    lat: -29.1655,
    lng: -51.1715,
    data: "Há 2 horas",
  },
];

export function FeedMapaScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const webViewRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);

  const snapPoints = useMemo(() => ["50%", "90%"], []);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
    setSheetOpen(true);
  }, []);

  // Injeta JavaScript na WebView para mover a câmera
  const focarNoMapa = (lat: number, lng: number) => {
    const script = `window.focarCoordenada(${lat}, ${lng}); true;`;
    if (webViewRef.current) {
      if (webViewRef.current.injectJavaScript) {
        webViewRef.current.injectJavaScript(script);
      } else if (webViewRef.current.contentWindow) {
        webViewRef.current.contentWindow.postMessage(script, "*");
      }
    }
  };

  // Ao rolar a lista de ocorrências no BottomSheet
  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const itemVisivel = viewableItems[0].item as Ocorrencia;
      focarNoMapa(itemVisivel.lat, itemVisivel.lng);
    }
  }, []);

  // Ao clicar em um pino dentro do mapa
  const handleMarkerSelect = (id: string) => {
    handleOpenSheet();
    const index = ocorrenciasMock.findIndex((item) => item.id === id);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapComponent
          webViewRef={webViewRef}
          onOpenSheet={handleOpenSheet}
          onMarkerSelect={handleMarkerSelect}
          showFab={!sheetOpen}
        />

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setSheetOpen(false)}
        >
          <View style={{ paddingHorizontal: 16 }}>
            <Text variant="titleMedium" style={styles.sheetTitle}>
              Ocorrências Próximas
            </Text>
          </View>

          <BottomSheetFlatList
            ref={flatListRef}
            data={ocorrenciasMock}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => focarNoMapa(item.lat, item.lng)}>
                <Card style={styles.card} mode="outlined">
                  <Card.Title title={item.titulo} subtitle={item.data} />
                  <Card.Content>
                    <Text variant="bodyMedium">{item.descricao}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sheetTitle: { fontWeight: "bold", color: "#35639f" },
  listContent: { padding: 16 },
  card: { marginBottom: 12, backgroundColor: "#fff" },
});
