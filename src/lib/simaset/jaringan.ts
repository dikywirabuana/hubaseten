export type RuasProperties = {
  id: string;
  name: string;
  kabupaten: string;
};

export type TitikProperties = {
  id: string;
  jenis: string;
  kategori: string;
  perlengkapan: string;
  kabupaten: string;
  ruas: string;
  kondisi: string;
};

export type RuasCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: RuasProperties;
    geometry: { type: "MultiLineString"; coordinates: number[][][] };
  }>;
};

export type TitikCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: TitikProperties;
    geometry: { type: "Point"; coordinates: [number, number] };
  }>;
};

export type JaringanMeta = {
  ruas: number;
  titik: number;
  kabupaten: { id: string; name: string; code: number }[];
  ruasPerKabupaten: Record<string, number>;
};

export type JaringanData = {
  ruas: RuasCollection;
  titik: TitikCollection;
  meta: JaringanMeta;
};

let cache: JaringanData | null = null;

export async function loadJaringan(): Promise<JaringanData> {
  if (cache) return cache;
  const [ruas, titik, meta] = await Promise.all([
    fetch("/data/ruas-provinsi.json").then((r) => r.json() as Promise<RuasCollection>),
    fetch("/data/perlengkapan-titik.json").then((r) => r.json() as Promise<TitikCollection>),
    fetch("/data/jaringan-meta.json").then((r) => r.json() as Promise<JaringanMeta>),
  ]);
  cache = { ruas, titik, meta };
  return cache;
}

export const PERLENGKAPAN_JENIS = ["RAMBU", "MARKA", "APILL", "APPJ", "PJU"] as const;
export type PerlengkapanJenis = (typeof PERLENGKAPAN_JENIS)[number];
