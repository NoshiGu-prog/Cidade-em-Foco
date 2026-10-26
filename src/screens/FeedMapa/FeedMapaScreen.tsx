import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

// ALTERADO: acrescentado useEffect.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Platform, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Card, Text } from "react-native-paper";

import { ocorrenciasMock } from "../../components/mock";

// ACRESCENTADO: leitura dos dados e acompanhamento das atualizações.
import { obterStatusAtual } from "../../services/historicoStatus";
import {
  assinarAtualizacoesOcorrencias,
  carregarOcorrencias,
} from "../../services/ocorrenciasStorage";

import { colors } from "../../theme/theme";
import type { OcorrenciaType, StatusOcorrencia } from "../../types/ocorrencia";
import MapComponent from "./map";

const CARD_HEIGHT = 270;
const CARD_GAP = 16;
const CARD_SNAP_INTERVAL = CARD_HEIGHT + CARD_GAP;

function calculateDistanceInMeters(
  origin: { lat: number; lng: number },
  destination: { lat?: number; lng?: number },
) {
  if (destination.lat == null || destination.lng == null) return null;

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
  if (distanceInMeters == null) return "Distância indisponível";

  return distanceInMeters < 1000
    ? `${Math.round(distanceInMeters)} m`
    : `${(distanceInMeters / 1000).toFixed(1).replace(".", ",")} km`;
}

// ALTERADO: apresenta os status com os mesmos nomes usados no feed.
function getStatusLabel(status: StatusOcorrencia) {
  const labels = {
    ENVIADA: "Enviada",
    EM_ANALISE: "Em análise",
    EM_ANDAMENTO: "Em andamento",
    RESOLVIDA: "Resolvida",
  };

  return labels[status];
}

export function FeedMapaScreen() {
  const { height: windowHeight } = useWindowDimensions();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const webViewRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);

  const pendingMapFocus = useRef<{ lat?: number; lng?: number } | null>(null);
  const mapReady = useRef(false);
  const isAutoScrolling = useRef(false);

  const snapPoints = useMemo(() => ["50%"], []);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // ACRESCENTADO: lista compartilhada com o armazenamento local.
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaType[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  // ACRESCENTADO: permite aos callbacks estáveis acessar a lista atual.
  const ocorrenciasRef = useRef<OcorrenciaType[]>([]);

  // ACRESCENTADO: carrega os dados e acompanha mudanças feitas no feed.
  useEffect(() => {
    let ativo = true;
    let recebeuAtualizacao = false;

    function aplicarLista(lista: OcorrenciaType[]) {
      if (!ativo) return;

      ocorrenciasRef.current = lista;
      setOcorrencias(lista);
      setErroCarregamento(null);
      setCarregando(false);
    }

    const cancelarAssinatura = assinarAtualizacoesOcorrencias((lista) => {
      recebeuAtualizacao = true;
      aplicarLista(lista);
    });

    async function iniciar() {
      try {
        const dadosSalvos = await carregarOcorrencias();

        // Evita substituir uma atualização nova por uma leitura anterior.
        if (!recebeuAtualizacao) {
          aplicarLista(dadosSalvos ?? ocorrenciasMock);
        }
      } catch {
        if (ativo && !recebeuAtualizacao) {
          setErroCarregamento(
            "Não foi possível carregar as ocorrências do mapa. Reabra a tela para tentar novamente.",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void iniciar();

    // ACRESCENTADO: remove a assinatura ao desmontar a tela.
    return () => {
      ativo = false;
      cancelarAssinatura();
    };
  }, []);

  // ALTERADO: callback estável e proteção contra coordenadas ausentes.
  const focarNoMapa = useCallback((lat?: number, lng?: number) => {
    if (lat == null || lng == null) return;

    pendingMapFocus.current = { lat, lng };

    if (!mapReady.current) return;

    const script =
      `typeof globalThis.focarCoordenada === 'function' && ` +
      `globalThis.focarCoordenada(${lat}, ${lng}); true;`;

    if (webViewRef.current?.injectJavaScript) {
      webViewRef.current.injectJavaScript(script);
    } else if (webViewRef.current?.contentWindow) {
      webViewRef.current.contentWindow.postMessage(
        JSON.stringify({ type: "FOCUS_COORDINATE", lat, lng }),
        "*",
      );
    }
  }, []);

  const handleMapReady = useCallback(() => {
    mapReady.current = true;
    const focus = pendingMapFocus.current;

    if (focus) {
      pendingMapFocus.current = null;
      focarNoMapa(focus.lat, focus.lng);
    }
  }, [focarNoMapa]);

  const handleMarkerSelect = (id: string) => {
    // ALTERADO: procura o marcador na lista atual.
    const index = ocorrenciasRef.current.findIndex((item) => item.id === id);
    if (index === -1) return;

    isAutoScrolling.current = true;
    bottomSheetRef.current?.snapToIndex(0);

    const delay = sheetOpen ? 50 : 400;
    setSheetOpen(true);

    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });

      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 600);
    }, delay);
  };

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (isAutoScrolling.current || viewableItems.length === 0) return;

      const itemVisivel = viewableItems[0].item as OcorrenciaType;
      focarNoMapa(itemVisivel.latitude, itemVisivel.longitude);
    },
    [focarNoMapa],
  );

  const handleScrollEnd = useCallback(
    (event: any) => {
      if (isAutoScrolling.current) return;

      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const reachedEnd =
        contentOffset.y + layoutMeasurement.height >= contentSize.height - 8;

      if (reachedEnd) {
        // ALTERADO: consulta a lista atual e trata uma lista vazia.
        const lista = ocorrenciasRef.current;
        const ultimaOcorrencia = lista[lista.length - 1];

        if (ultimaOcorrencia) {
          focarNoMapa(ultimaOcorrencia.latitude, ultimaOcorrencia.longitude);
        }
      }
    },
    [focarNoMapa],
  );

  // ACRESCENTADO: aguarda a leitura antes de montar o mapa.
  if (carregando || erroCarregamento) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          backgroundColor: colors.background,
        }}
      >
        <Text>{erroCarregamento ?? "Carregando ocorrências do mapa..."}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapComponent
          webViewRef={webViewRef}
          onOpenSheet={() => {
            bottomSheetRef.current?.snapToIndex(0);
            setSheetOpen(true);
          }}
          onMarkerSelect={handleMarkerSelect}
          onUserLocationChange={setUserLocation}
          onMapReady={handleMapReady}
          showFab={!sheetOpen}
          // ALTERADO: envia ao mapa os dados carregados e atualizados.
          list={ocorrencias}
        />

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          enableContentPanningGesture={false}
          onChange={(index) => {
            setSheetOpen(index !== -1);
          }}
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
            // ALTERADO: os cartões usam a mesma lista enviada ao mapa.
            data={ocorrencias}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              backgroundColor: colors.background,
              paddingBottom: Math.max(0, windowHeight - CARD_HEIGHT),
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
            // ACRESCENTADO: retorno para uma lista sem ocorrências.
            ListEmptyComponent={<Text>Nenhuma ocorrência disponível.</Text>}
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
                    subtitle={`Status: ${getStatusLabel(obterStatusAtual(item))}`}
                  />

                  <Card.Content
                    style={{
                      paddingBottom: 8,
                      justifyContent: "space-between",
                      flex: 1,
                    }}
                  >
                    <Text style={{ overflow: "hidden" }}>{item.descricao}</Text>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ textAlign: "right" }}>
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
