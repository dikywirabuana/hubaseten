import type { Category, Condition } from "./types";
import { CATEGORY_LABEL, CONDITION_LABEL } from "./types";

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(Number.isFinite(value) ? value : 0);
}

export function num(value: string | number | null | undefined): number {
  if (value == null || value === "") return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function categoryLabel(c: string): string {
  return CATEGORY_LABEL[c as Category] ?? c;
}

export function conditionLabel(c: string): string {
  return CONDITION_LABEL[c as Condition] ?? c;
}

export function displayAssetName(a: { name: string; brand: string | null; spec?: string | null }): string {
  const name = a.name.trim();
  const brand = a.brand?.trim() ?? "";
  if (!brand) return name;
  if (name.toLowerCase().includes(brand.toLowerCase())) return name;
  return `${brand} ${name}`;
}

export function displayAssetType(a: { spec?: string | null; name: string; yearAcquired?: number | null }): string {
  const spec = a.spec?.trim() ?? "";
  const year = a.yearAcquired ? `TA ${a.yearAcquired}` : "";
  if (spec && year && !spec.includes(String(a.yearAcquired))) return `${spec} · ${year}`;
  if (spec) return spec;
  return year;
}

export function vehiclePlate(serialNo: string | null | undefined): string | null {
  const s = serialNo?.trim() ?? "";
  if (!s) return null;
  return s;
}

export function vehicleBpkb(notes: string | null | undefined): string | null {
  const s = notes?.trim() ?? "";
  const m = s.match(/BPKB\s+([A-Z0-9.\- ]{4,20})/i);
  return m ? m[1].trim() : null;
}

export function siteTypeLabel(t: string): string {
  const map: Record<string, string> = {
    ruas: "Ruas Jalan",
    simpang: "Simpang",
    terminal: "Terminal",
    pelabuhan: "Pelabuhan",
    halte: "Halte",
    area: "Area Operasional",
    pkb: "Pengujian Kendaraan",
    pos: "Pos Pelintasan / Pos Jaga",
    sekolah: "Sekolah / ZOSS",
  };
  return map[t] ?? t;
}
