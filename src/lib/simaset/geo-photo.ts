export type GeoPoint = { lat: number; lng: number };

export function compressImage(file: Blob, max = 960, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas tidak tersedia"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal membaca foto"));
    };
    img.src = url;
  });
}

export function readDeviceGeo(): Promise<GeoPoint | null> {
  if (!navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 15000 },
    );
  });
}

function gpsToDecimal(values: number[], refs: string): number {
  const d = values[0] ?? 0;
  const m = values[1] ?? 0;
  const s = values[2] ?? 0;
  let dec = d + m / 60 + s / 3600;
  if (refs === "S" || refs === "W") dec = -dec;
  return dec;
}

export async function readJpegGps(file: Blob): Promise<GeoPoint | null> {
  const buf = await file.arrayBuffer();
  const view = new DataView(buf);
  if (view.byteLength < 12 || view.getUint16(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 4 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    const size = view.getUint16(offset + 2);
    if (marker === 0xe1) {
      const start = offset + 4;
      if (ascii(view, start, 4) === "Exif") {
        return parseExifGps(view, start + 6);
      }
    }
    if (marker === 0xda) break;
    offset += 2 + size;
  }
  return null;
}

function ascii(view: DataView, start: number, len: number): string {
  let s = "";
  for (let i = 0; i < len; i += 1) s += String.fromCharCode(view.getUint8(start + i));
  return s;
}

function parseExifGps(view: DataView, tiff: number): GeoPoint | null {
  const le = view.getUint16(tiff) === 0x4949;
  const u16 = (p: number) => (le ? view.getUint16(p, true) : view.getUint16(p, false));
  const u32 = (p: number) => (le ? view.getUint32(p, true) : view.getUint32(p, false));
  const ifd0 = tiff + u32(tiff + 4);
  const gpsOffset = findTagOffset(view, ifd0, tiff, 0x8825, le, u16, u32);
  if (gpsOffset == null) return null;
  const gpsIfd = tiff + gpsOffset;
  const lat = readGpsRational(view, gpsIfd, tiff, 0x0002, le, u16, u32);
  const latRef = readGpsAscii(view, gpsIfd, tiff, 0x0001, le, u16, u32);
  const lng = readGpsRational(view, gpsIfd, tiff, 0x0004, le, u16, u32);
  const lngRef = readGpsAscii(view, gpsIfd, tiff, 0x0003, le, u16, u32);
  if (!lat || !lng || !latRef || !lngRef) return null;
  return { lat: gpsToDecimal(lat, latRef), lng: gpsToDecimal(lng, lngRef) };
}

function findTagOffset(
  view: DataView,
  ifd: number,
  tiff: number,
  tag: number,
  le: boolean,
  u16: (p: number) => number,
  u32: (p: number) => number,
): number | null {
  if (ifd + 2 > view.byteLength) return null;
  const n = u16(ifd);
  for (let i = 0; i < n; i += 1) {
    const p = ifd + 2 + i * 12;
    if (u16(p) === tag) {
      const type = u16(p + 2);
      void type;
      void le;
      void tiff;
      return u32(p + 8);
    }
  }
  return null;
}

function readGpsAscii(
  view: DataView,
  ifd: number,
  tiff: number,
  tag: number,
  le: boolean,
  u16: (p: number) => number,
  u32: (p: number) => number,
): string | null {
  const n = u16(ifd);
  for (let i = 0; i < n; i += 1) {
    const p = ifd + 2 + i * 12;
    if (u16(p) !== tag) continue;
    const count = u32(p + 4);
    if (count <= 4) return ascii(view, p + 8, 1);
    return ascii(view, tiff + u32(p + 8), 1);
  }
  void le;
  return null;
}

function readGpsRational(
  view: DataView,
  ifd: number,
  tiff: number,
  tag: number,
  le: boolean,
  u16: (p: number) => number,
  u32: (p: number) => number,
): number[] | null {
  const n = u16(ifd);
  for (let i = 0; i < n; i += 1) {
    const p = ifd + 2 + i * 12;
    if (u16(p) !== tag) continue;
    const count = u32(p + 4);
    const off = tiff + u32(p + 8);
    const out: number[] = [];
    for (let k = 0; k < Math.min(count, 3); k += 1) {
      const num = u32(off + k * 8);
      const den = u32(off + k * 8 + 4) || 1;
      out.push(num / den);
    }
    return out;
  }
  void le;
  return null;
}
