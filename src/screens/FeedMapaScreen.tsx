import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card, Text } from "react-native-paper";

import { ocorrenciasMock } from "../components/mock";
import { colors } from "../theme/theme";
import { OcorrenciaType } from "../types/ocorrencia";
import MapComponent from "./FeedMapa/map";

const CARD_HEIGHT = 250;
const CARD_GAP = 16;
const CARD_SNAP_INTERVAL = CARD_HEIGHT + CARD_GAP;

export function FeedMapaScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const webViewRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);
  const skippedInitialListFocus = useRef(false);

  const snapPoints = useMemo(() => ["50%", "100%"], []);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
    setSheetOpen(true);
  }, []);

  // Injeta JavaScript na WebView para mover a câmera
  const focarNoMapa = (lat?: number, lng?: number) => {
    const script = `window.focarCoordenada(${lat}, ${lng}); true;`;
    if (webViewRef.current) {
      if (webViewRef.current.injectJavaScript) {
        webViewRef.current.injectJavaScript(script);
      } else if (webViewRef.current.contentWindow) {
        webViewRef.current.contentWindow.postMessage(
          JSON.stringify({ type: "FOCUS_COORDINATE", lat, lng }),
          "*",
        );
      }
    }
  };

  // Ao rolar a lista de ocorrências no BottomSheet
  const handleViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (!skippedInitialListFocus.current) {
      skippedInitialListFocus.current = true;
      return;
    }

    if (viewableItems.length > 0) {
      const itemVisivel = viewableItems[0].item as OcorrenciaType;
      console.log({ itemVisivel });
      focarNoMapa(itemVisivel?.latitude, itemVisivel?.longitude);
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
      <View style={{ flex: 1 }}>
        <MapComponent
          webViewRef={webViewRef}
          onOpenSheet={handleOpenSheet}
          onMarkerSelect={handleMarkerSelect}
          showFab={!sheetOpen}
          list={ocorrenciasMock}
        />

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={() => setSheetOpen(false)}
        >
          <View
            style={{
              paddingHorizontal: 16,
              backgroundColor: colors.background,
            }}
          >
            <Text
              variant="titleMedium"
              style={{ fontWeight: "bold", marginBottom: 8 }}
            >
              Ocorrências Próximas
            </Text>
          </View>

          <BottomSheetFlatList
            ref={flatListRef}
            data={ocorrenciasMock}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 16,
              backgroundColor: colors.background,
            }}
            style={
              Platform.OS === "web"
                ? ({ scrollSnapType: "y mandatory" } as any)
                : undefined
            }
            snapToInterval={CARD_SNAP_INTERVAL}
            snapToAlignment="start"
            disableIntervalMomentum
            getItemLayout={(_, index) => ({
              length: CARD_SNAP_INTERVAL,
              offset: CARD_SNAP_INTERVAL * index,
              index,
            })}
            onViewableItemsChanged={handleViewableItemsChanged}
            renderItem={({ item }: { item: OcorrenciaType }) => (
              <TouchableOpacity
                onPress={() => focarNoMapa(item.latitude, item.longitude)}
                style={[
                  { height: CARD_HEIGHT, marginBottom: CARD_GAP },
                  Platform.OS === "web"
                    ? ({
                        scrollSnapAlign: "start",
                        scrollSnapStop: "always",
                      } as any)
                    : undefined,
                ]}
              >
                <Card
                  mode="elevated"
                  style={{ height: CARD_HEIGHT, backgroundColor: "white" }}
                >
                  <Card.Cover
                    source={{ uri: item.imagem }}
                    style={{ height: 180 }}
                  />
                  <Card.Title
                    title={item.descricao}
                    titleVariant="titleMedium"
                    subtitle={`Criado em: ${new Date(item.criadaEm).toLocaleDateString("pt-BR")}`}
                  />
                </Card>
              </TouchableOpacity>
            )}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}
