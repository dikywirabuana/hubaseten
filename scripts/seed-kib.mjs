/**
 * Load official KIB B/C/D rows from data/kib-seed.json.gz.
 * Used by deploy migrate (Neon) and the PGLite preview fallback.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** @param {(text: string, params?: unknown[]) => Promise<unknown>} query */
export async function seedKib(query) {
  const existing = await query("select count(*)::int as c from assets where id like $1", [
    "kib-%",
  ]);
  const count = Number(rowCount(existing));
  if (count > 0) {
    console.log(`[seed-kib] already loaded (${count} rows) — skip`);
    return;
  }

  const buf = await readFile(join(root, "data/kib-seed.json.gz"));
  const data = JSON.parse(gunzipSync(buf).toString("utf8"));
  const sites = data.sites ?? [];
  const assets = data.assets ?? [];

  const siteSql = `insert into outdoor_sites
    (id, code, name, corridor, kabupaten, km_label, lat, lng, site_type, description, sort_order)
    values ($1,$2,$3,$4,$5,null,$6,$7,$8,$9,$10)
    on conflict (id) do nothing`;
  for (const s of sites) {
    await query(siteSql, s);
  }

  const assetSql = `insert into assets
    (id, register_no, kib_code, kib_group, category, topology, name, spec, brand, material,
     year_acquired, quantity, unit, unit_price, condition, room_id, outdoor_site_id, bidang_id,
     source_of_funds, serial_no, notes, lat, lng)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,0,$14,$15,$16,$17,$18,$19,$20,$21,$22)
    on conflict (id) do nothing`;
  const BATCH = 40;
  for (let i = 0; i < assets.length; i += BATCH) {
    for (const a of assets.slice(i, i + BATCH)) {
      await query(assetSql, a);
    }
  }
  console.log(`[seed-kib] inserted ${sites.length} sites, ${assets.length} assets`);
}

/** @param {unknown} result */
function rowCount(result) {
  if (Array.isArray(result)) return /** @type {{c?: number}[]} */ (result)[0]?.c ?? 0;
  const rows = /** @type {{rows?: {c?: number}[]} | null} */ (result)?.rows;
  if (Array.isArray(rows)) return rows[0]?.c ?? 0;
  return 0;
}
