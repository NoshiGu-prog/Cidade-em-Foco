import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card, Text } from "react-native-paper";

import { ocorrenciasMock } from "../../components/mock";
import { colors } from "../../theme/theme";
import { OcorrenciaType } from "../../types/ocorrencia";
import MapComponent from "./map";

const CARD_HEIGHT = 270;
const CARD_GAP = 16;
const CARD_SNAP_INTERVAL = CARD_HEIGHT + CARD_GAP;

function calculateDistanceInMeters(
  origin: { lat: number; lng: number },
  destination: { lat?: number; lng?: number },
) {
  if (destination.lat == null || destination.lng == null) {
    return null;
  }

  const earthRadius = 6371000;
  const latitudeDifference = ((destination.lat - origin.lat) * Math.PI) / 180;
  const longitudeDifference = ((destination.lng - origin.lng) * Math.PI) / 180;
  const originLatitude = (origin.lat * Math.PI) / 180;
  const destinationLatitude = (destination.lat * Math.PI) / 180;
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  return (
    2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

function formatDistance(distanceInMeters: number | null) {
  if (distanceInMeters == null) {
    return "Distância indisponível";
  }

  return distanceInMeters < 1000
    ? `${Math.round(distanceInMeters)} m`
    : `${(distanceInMeters / 1000).toFixed(1).replace(".", ",")} km`;
}

function getStatusLabel(status: OcorrenciaType["status"]) {
  return status.replace("_", " ");
}

export function FeedMapaScreen() {
  // Pegando a altura da tela
  const { height: windowHeight } = useWindowDimensions();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const webViewRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);
  const skippedInitialListFocus = useRef(false);
  const pendingOccurrenceId = useRef<string | null>(null);

  const snapPoints = useMemo(() => ["50%", "100%"], []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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
    const selectedItem = pendingOccurrenceId.current
      ? viewableItems.find(
          ({ item }: { item: OcorrenciaType }) =>
            item.id === pendingOccurrenceId.current,
        )?.item
      : null;

    if (pendingOccurrenceId.current && !selectedItem) {
      return;
    }

    if (!skippedInitialListFocus.current) {
      skippedInitialListFocus.current = true;
      return;
    }

    if (viewableItems.length > 0) {
      const itemVisivel = (selectedItem ??
        viewableItems[0].item) as OcorrenciaType;
      pendingOccurrenceId.current = null;
      console.log({ itemVisivel });
      focarNoMapa(itemVisivel?.latitude, itemVisivel?.longitude);
    }
  }, []);

  const handleScrollEnd = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const reachedEnd =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 8;

    if (reachedEnd) {
      const lastOccurrence = ocorrenciasMock[ocorrenciasMock.length - 1];
      pendingOccurrenceId.current = null;
      focarNoMapa(lastOccurrence.latitude, lastOccurrence.longitude);
    }
  }, []);

  // Ao clicar em um pino dentro do mapa
  const handleMarkerSelect = (id: string) => {
    pendingOccurrenceId.current = id;
    skippedInitialListFocus.current = true;
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
          onUserLocationChange={setUserLocation}
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
              backgroundColor: colors.background,
              // Espaço extra no final garante que o último card possa subir até o topo
              paddingBottom: windowHeight - CARD_HEIGHT,
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
            onMomentumScrollEnd={handleScrollEnd}
            renderItem={({ item }: { item: OcorrenciaType }) => (
              <View
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
                    style={{ height: 112 }}
                  />
                  <Card.Title
                    title={item.endereco}
                    subtitleVariant="titleSmall"
                    titleVariant="titleMedium"
                    subtitle={`Status: ${getStatusLabel(item.status)}`}
                  />
                  <Card.Content
                    style={{
                      paddingBottom: 8,
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <Text
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      {item.descricao}
                    </Text>
                    <View
                      style={{
                        alignItems: "flex-end",
                      }}
                    >
                      <Text style={{ textAlign: "right" }}>
                        há{" "}
                        {formatDistance(
                          userLocation
                            ? calculateDistanceInMeters(userLocation, {
                                lat: item.latitude,
                                lng: item.longitude,
                              })
                            : null,
                        )}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </View>
            )}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}
