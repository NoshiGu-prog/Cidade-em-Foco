import * as Location from "expo-location";
import { Binoculars } from "lucide-react-native";
import { RefObject, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { ActivityIndicator, FAB, Text } from "react-native-paper";
import { WebView } from "react-native-webview";
import { colors } from "../../theme/theme";

const chamadosMock = [
  { id: "1", lat: -29.1635, lng: -51.1742, titulo: "Buraco na Pista" },
  { id: "2", lat: -29.1661, lng: -51.173, titulo: "Poste Apagado" },
  { id: "3", lat: -29.1655, lng: -51.1715, titulo: "Radar Móvel" },
];

interface MapComponentProps {
  webViewRef?: RefObject<any>;
  onMarkerSelect?: (chamadoId: string) => void;
  onOpenSheet?: () => void;
  showFab?: boolean;
}

export default function MapComponent({
  webViewRef,
  onMarkerSelect,
  onOpenSheet,
  showFab = true,
}: MapComponentProps) {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("Buscando sua localização...");

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

            var chamados = ${JSON.stringify(chamadosMock)};
            chamados.forEach(function(chamado) {
                var marker = L.marker([chamado.lat, chamado.lng]).addTo(map);
                marker.bindPopup("<b>" + chamado.titulo + "</b>");
                
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
        </script>
    </body>
    </html>
  `
    : "";

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(
        event.nativeEvent ? event.nativeEvent.data : event.data,
      );
      if (data.type === "MARKER_CLICK") {
        onMarkerSelect?.(data.id);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
      )}
    </View>
  );
}
