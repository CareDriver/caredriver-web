export function createGoogleMapsUrl(
  position:
    | {
        lat: number;
        lng: number;
      }
    | undefined
    | null,
): string {
  let mapUrl: string;
  if (position) {
    const lat = position.lat;
    const lng = position.lng;
    const zoom = 18.67;
    mapUrl = `https://www.google.com/maps/@${lat},${lng},${zoom}z`;
  } else {
    mapUrl = "https://www.google.com/maps";
  }

  return mapUrl;
}
