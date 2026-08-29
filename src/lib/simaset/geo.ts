export function googleMapsSearchUrl(lat: number, lng: number, name?: string): string {
  const query = name ? `${name}, Provinsi Banten` : `${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googlePlaceSearchUrl(name: string): string {
  const q = /banten/i.test(name) ? name : `${name}, Provinsi Banten`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function googleStreetViewUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
}

/** Utamakan nama lokasi — koordinat KIB sering centroid, bukan titik ruas. */
export function locationStreetViewUrl(opts: {
  lat?: number | null;
  lng?: number | null;
  name?: string | null;
}): string | null {
  const name = opts.name?.trim();
  if (name) {
    return googlePlaceSearchUrl(name);
  }
  if (opts.lat != null && opts.lng != null) {
    return googleStreetViewUrl(opts.lat, opts.lng);
  }
  return null;
}

export function googleMapsEmbedUrl(
  lat: number,
  lng: number,
  name: string,
  opts?: { zoom?: number; satellite?: boolean },
): string {
  const zoom = opts?.zoom ?? (opts?.satellite ? 16 : 14);
  const layer = opts?.satellite ? "k" : "m";
  const q = encodeURIComponent(`${name}, Provinsi Banten`);
  return `https://maps.google.com/maps?q=${q}&z=${zoom}&t=${layer}&hl=id&output=embed`;
}

export function googleStreetViewEmbedUrl(lat: number, lng: number): string {
  return `https://maps.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&hl=id&output=embed`;
}

export function openStreetView(lat: number, lng: number, name?: string) {
  const url = name ? googlePlaceSearchUrl(name) : googleStreetViewUrl(lat, lng);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function bantenOverviewEmbedUrl(): string {
  return "https://maps.google.com/maps?q=Provinsi+Banten&z=9&hl=id&output=embed";
}
