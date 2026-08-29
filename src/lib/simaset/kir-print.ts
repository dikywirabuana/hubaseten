import { conditionLabel, displayAssetName, formatNumber, vehicleBpkb, vehiclePlate } from "./format";
import type { Asset, Room } from "./types";

function esc(value: string): string {
  return [...value]
    .map((ch) => {
      if (ch === "&") return "&" + "amp;";
      if (ch === "<") return "&" + "lt;";
      if (ch === ">") return "&" + "gt;";
      if (ch === '"') return "&" + "quot;";
      return ch;
    })
    .join("");
}

function assetRows(assets: Asset[]): string {
  if (assets.length === 0) {
    return `<tr><td colspan="10" style="border:1px solid #111;padding:12px;text-align:center">Tidak ada barang pada ruangan ini.</td></tr>`;
  }
  const body = assets
    .map((a, i) => {
      const ket = [
        conditionLabel(a.condition),
        a.category === "kendaraan" && vehiclePlate(a.serialNo) ? `Plat ${vehiclePlate(a.serialNo)}` : "",
        a.category === "kendaraan" && vehicleBpkb(a.notes) ? `BPKB ${vehicleBpkb(a.notes)}` : "",
        a.notes && a.category !== "kendaraan" ? a.notes : "",
      ]
        .filter(Boolean)
        .join(" · ");
      const merk = [a.brand, a.spec].filter(Boolean).join(" · ") || "—";
      return `<tr>
        <td>${i + 1}</td>
        <td>${esc(a.kibCode)}</td>
        <td>${esc(displayAssetName(a))}</td>
        <td>${esc(merk)}</td>
        <td>${esc(a.registerNo)}</td>
        <td>${esc(a.material ?? "—")}</td>
        <td>${a.yearAcquired ?? "—"}</td>
        <td>${formatNumber(a.quantity)}</td>
        <td>${esc(a.unit)}</td>
        <td>${esc(ket)}</td>
      </tr>`;
    })
    .join("");
  const qty = assets.reduce((s, a) => s + a.quantity, 0);
  return `${body}<tr>
    <td colspan="7" style="text-align:right;font-weight:700">Jumlah</td>
    <td style="font-weight:700">${formatNumber(qty)}</td>
    <td></td><td></td>
  </tr>`;
}

export function kirFilename(room: Room, ext: string): string {
  const slug = room.name.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `KIR-${slug || room.id}.${ext}`;
}

export function buildKirHtml(room: Room, assets: Asset[], qr: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const banten = `${origin}/brand/lambang-banten.png`;
  const dishub = `${origin}/brand/lambang-perhubungan.png`;
  const title = room.name.replace(/^ruang(an)?\s+/i, "").trim().toUpperCase();
  const year = new Date().getFullYear();
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>KIR ${esc(room.name)}</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    * { box-sizing: border-box; }
    body { font-family: "Times New Roman", serif; color: #111; background: #fff; margin: 0; }
    .plaque { width: 277mm; max-width: 100%; min-height: 180mm; margin: 0 auto 12mm; padding: 14mm 16mm; border: 1px solid #1e4d86; position: relative; page-break-after: always; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .seal { width: 78px; height: 78px; object-fit: contain; }
    h1 { font-size: 26px; letter-spacing: .12em; color: #8a7344; text-transform: uppercase; margin: 8px 0 0; text-align: center; }
    h2 { font-size: 20px; letter-spacing: .14em; color: #8a7344; text-transform: uppercase; margin: 4px 0 0; text-align: center; }
    .kicker { text-align: center; color: #b42318; letter-spacing: .28em; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 18px; }
    .room { text-align: center; font-size: 28px; letter-spacing: .08em; margin: 10px 0 0; }
    .meta { text-align: center; font-size: 13px; margin-top: 8px; }
    .qr { width: 92px; height: 92px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { border: 1px solid #111; padding: 4px 6px; text-align: left; vertical-align: top; }
    th { background: #f3f3f3; }
    .sheet { max-width: 277mm; margin: 0 auto; padding: 0 8px 24px; }
    .sign { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; text-align: center; margin-top: 28px; font-size: 12px; }
  </style>
</head>
<body>
  <article class="plaque">
    <div class="row">
      <img class="seal" src="${banten}" alt="Lambang Banten" />
      <div style="flex:1">
        <h1>Barang milik daerah</h1>
        <h2>Dinas Perhubungan</h2>
      </div>
      <img class="seal" src="${dishub}" alt="Lambang Perhubungan" />
    </div>
    <p class="kicker">Kartu inventaris ruangan</p>
    <p class="room">RUANGAN ${esc(title)}</p>
    <p class="meta">${esc(room.building)} · ${esc(room.floor)} · Kode ${esc(room.code)}<br/>
      ${esc(room.bidangName)}${room.subBidangName ? " · " + esc(room.subBidangName) : ""}<br/>
      Penanggung jawab: ${esc(room.picName ?? "—")}${room.picNip ? " · NIP. " + esc(room.picNip) : ""}
    </p>
    <div class="row" style="margin-top:18px;align-items:flex-end">
      <div style="font-size:12px">Pemerintah Provinsi Banten<br/>Tahun ${year}</div>
      ${qr ? `<img class="qr" src="${qr}" alt="QR KIR" />` : ""}
    </div>
  </article>
  <article class="sheet">
    <h2 style="color:#111;letter-spacing:0;text-transform:none;font-size:20px;text-align:left">Lampiran KIR · ${esc(room.name)}</h2>
    <p style="font-size:12px">SKPD: Dinas Perhubungan Provinsi Banten · ${esc(room.bidangName)} · ${formatNumber(assets.length)} jenis barang</p>
    <table>
      <thead>
        <tr>
          <th>No</th><th>Kode barang</th><th>Nama barang</th><th>Merk / type</th>
          <th>No. register</th><th>Bahan</th><th>Thn</th><th>Jml</th><th>Sat</th><th>Ket / kondisi</th>
        </tr>
      </thead>
      <tbody>${assetRows(assets)}</tbody>
    </table>
    <div class="sign">
      <div>Pengurus Barang<br/><br/><br/>________________<br/>NIP.</div>
      <div>Penanggung Jawab Ruangan<br/><br/><br/>${esc(room.picName ?? "________________")}<br/>${esc(room.picNip ? "NIP. " + room.picNip : "NIP.")}</div>
      <div>Pengguna Barang<br/><br/><br/>Endad Haryanto, SE, M.Si<br/>NIP. 19730403 200112 1 003</div>
    </div>
  </article>
</body>
</html>`;
}

export function kirBlobUrl(html: string): string {
  return URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
}
