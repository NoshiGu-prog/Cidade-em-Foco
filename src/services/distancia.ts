// Item 10: cálculo de distância compartilhado pelo mapa e pelo agrupamento.
export function calculateDistanceInMeters(
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
