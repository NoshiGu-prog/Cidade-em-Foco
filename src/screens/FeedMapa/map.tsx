import * as Location from "expo-location";
import { Binoculars, LocateFixed } from "lucide-react-native";
import { RefObject, useCallback, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { ActivityIndicator, FAB, Text } from "react-native-paper";
import { WebView } from "react-native-webview";
import { colors } from "../../theme/theme";
import { OcorrenciaType } from "../../types/ocorrencia";

interface MapComponentProps {
  webViewRef?: RefObject<any>;
  onMarkerSelect?: (chamadoId: string) => void;
  onOpenSheet?: () => void;
  onUserLocationChange?: (location: { lat: number; lng: number }) => void;
  showFab?: boolean;
  list: OcorrenciaType[];
}

export default function MapComponent({
  webViewRef,
  onMarkerSelect,
  onOpenSheet,
  onUserLocationChange,
  showFab = true,
  list,
}: MapComponentProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("Buscando sua localização...");

  useEffect(() => {
    if (userLocation) {
      onUserLocationChange?.(userLocation);
    }
  }, [onUserLocationChange, userLocation]);

  const focarNaLocalizacao = () => {
    if (!userLocation || !webViewRef?.current) {
      return;
    }

    const { lat, lng } = userLocation;
    const script = `window.focarCoordenada(${lat}, ${lng}); true;`;

    if (webViewRef.current.injectJavaScript) {
      webViewRef.current.injectJavaScript(script);
    } else if (webViewRef.current.contentWindow) {
      webViewRef.current.contentWindow.postMessage(
        JSON.stringify({ type: "FOCUS_COORDINATE", lat, lng }),
        "*",
      );
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoadingMsg("Permissão negada. Carregando mapa padrão...");
          setUserLocation({ lat: -29.165, lng: -51.174 });
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (error) {
        console.log("Erro ao buscar GPS:", error);
        setUserLocation({ lat: -29.165, lng: -51.174 });
      }
    })();
  }, []);

  const mapHtml = userLocation
    ? `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body { padding: 0; margin: 0; }
            html, body, #map { height: 100%; width: 100%; }
            .custom-marker-wrapper { background: transparent; border: none; }
            .custom-marker {
                display: block;
                width: 24px;
                height: 24px;
                border: 3px solid #ffffff;
                border-radius: 50% 50% 50% 0;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
                transform: rotate(-45deg);
            }
            .custom-marker-normal { background: #35639f; }
            .custom-marker-dangerous { background: #d32f2f; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var map = L.map('map').setView([${userLocation.lat}, ${userLocation.lng}], 15);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            L.circleMarker([${userLocation.lat}, ${userLocation.lng}], {
                color: '#ffffff',
                weight: 2,
                fillColor: '#35639f',
                fillOpacity: 1,
                radius: 8
            }).addTo(map).bindPopup("<b>Você está aqui</b>");

            var chamados = ${JSON.stringify(list)};
            chamados.forEach(function(chamado) {
              var markerClass = chamado.perigosa
                ? 'custom-marker-dangerous'
                : 'custom-marker-normal';
              var marker = L.marker([chamado.latitude, chamado.longitude], {
                icon: L.divIcon({
                  className: 'custom-marker-wrapper',
                  html: '<span class="custom-marker ' + markerClass + '"></span>',
                  iconSize: [30, 30],
                  iconAnchor: [15, 30]
                })
              }).addTo(map);
                marker.bindPopup("<b>" + chamado.descricao + "</b>");
                // Envia mensagem para o React Native ao clicar no pino do mapa
                marker.on('click', function() {
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MARKER_CLICK', id: chamado.id }));
                    } else if (window.parent) {
                        window.parent.postMessage(JSON.stringify({ type: 'MARKER_CLICK', id: chamado.id }), '*');
                    }
                });
            });

            window.focarCoordenada = function(lat, lng) {
                map.flyTo([lat, lng], 17, {
                    animate: true,
                    duration: 1.5
                });
            };

            window.addEventListener('message', function(event) {
              var data = typeof event.data === 'string'
                ? JSON.parse(event.data)
                : event.data;

              if (data.type === 'FOCUS_COORDINATE') {
                window.focarCoordenada(data.lat, data.lng);
              }
            });
        </script>
    </body>
    </html>
  `
    : "";

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const message = event.nativeEvent?.data ?? event.data;
        const data =
          typeof message === "string" ? JSON.parse(message) : message;

        if (data.type === "MARKER_CLICK") {
          onMarkerSelect?.(data.id);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [onMarkerSelect],
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      window.addEventListener("message", handleMessage);

      return () => window.removeEventListener("message", handleMessage);
    }

    return undefined;
  }, [handleMessage]);

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      {!userLocation ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator animating={true} color="#35639f" size="large" />
          <Text style={{ marginTop: 16, color: "#333" }}>{loadingMsg}</Text>
        </View>
      ) : Platform.OS === "web" ? (
        <iframe
          ref={webViewRef}
          srcDoc={mapHtml}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Mapa"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          style={{ flex: 1 }}
          scrollEnabled={false}
          bounces={false}
          onMessage={handleMessage}
        />
      )}

      {userLocation && showFab && (
        <>
          <FAB
            size="medium"
            icon={() => <LocateFixed color="#fff" size={24} />}
            style={{
              position: "absolute",
              right: 20,
              bottom: 84,
              backgroundColor: colors.brandBlue,
              borderRadius: 100,
            }}
            onPress={focarNaLocalizacao}
          />
          <FAB
            size="medium"
            icon={() => <Binoculars color="#fff" size={24} />}
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              backgroundColor: colors.brandGreen,
              borderRadius: 100,
            }}
            onPress={onOpenSheet}
          />
        </>
      )}
    </View>
  );
}
