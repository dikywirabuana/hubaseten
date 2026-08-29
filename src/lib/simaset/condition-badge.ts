import type { Condition } from "./types";

export function conditionVariant(c: Condition): "good" | "warn" | "bad" | "muted" {
  if (c === "baik") return "good";
  if (c === "rusak_ringan") return "warn";
  if (c === "rusak_berat" || c === "hilang") return "bad";
  return "muted";
}
