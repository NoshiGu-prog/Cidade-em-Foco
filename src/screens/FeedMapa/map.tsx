import * as Location from "expo-location";
import { Binoculars } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { ActivityIndicator, FAB, Text } from "react-native-paper";
import { WebView } from "react-native-webview";
import { colors } from "../../theme/theme";

// Dados dos chamados que vamos passar para o mapa
const chamadosMock = [
  { id: "1", lat: -29.1635, lng: -51.1742, titulo: "Buraco na Pista" },
  { id: "2", lat: -29.1661, lng: -51.173, titulo: "Poste Apagado" },
  { id: "3", lat: -29.1655, lng: -51.1715, titulo: "Radar Móvel" },
];

export default function MapComponent() {
  const [userLocation, setUserLocation] = useState({
    lat: -29.165,
    lng: -51.174,
  });
  const [loadingMsg, setLoadingMsg] = useState("Buscando sua localização...");

  // Efeito para buscar a localização ao abrir o App
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoadingMsg("Permissão negada. Carregando mapa padrão...");
          // Se negar, joga para uma localização padrão (Ex: Caxias do Sul)
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
        // Em caso de erro (ex: sem internet/GPS desligado), vai para o padrão
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
            // 1. Inicializa o mapa centralizado na localização do usuário
            var map = L.map('map').setView([${userLocation.lat}, ${userLocation.lng}], 15);

            // 2. Carrega o mapa gratuito
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            // 3. Adiciona a "Bolinha Azul" do usuário
            L.circleMarker([${userLocation.lat}, ${userLocation.lng}], {
                color: '#ffffff', // Borda branca
                weight: 2,
                fillColor: '#35639f', // Azul combinando com o App
                fillOpacity: 1,
                radius: 8
            }).addTo(map).bindPopup("<b>Você está aqui</b>");

            // 4. Carrega os chamados do banco (Mock)
            var chamados = ${JSON.stringify(chamadosMock)};
            chamados.forEach(function(chamado) {
                var marker = L.marker([chamado.lat, chamado.lng]).addTo(map);
                marker.bindPopup("<b>" + chamado.titulo + "</b>");
            });
        </script>
    </body>
    </html>
  `
    : "";

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      {/* Mostra um Loading até o GPS responder */}
      {!userLocation ? (
        <View>
          <ActivityIndicator animating={true} color="#35639f" size="large" />
          <Text style={{ marginTop: 16, color: "#333" }}>{loadingMsg}</Text>
        </View>
      ) : Platform.OS === "web" ? (
        <iframe
          srcDoc={mapHtml}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Mapa"
        />
      ) : (
        <WebView
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          style={{ flex: 1 }}
          scrollEnabled={false}
          bounces={false}
        />
      )}

      {/* Botão Flutuante */}
      {userLocation && (
        <FAB
          size="medium"
          icon={() => <Binoculars />}
          style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            backgroundColor: colors.brandGreen,
            borderRadius: 100,
          }}
          onPress={() => console.log("Explorar")}
        />
      )}
    </View>
  );
}
