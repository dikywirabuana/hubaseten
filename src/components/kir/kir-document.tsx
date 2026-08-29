import { conditionLabel, displayAssetName, formatNumber, vehicleBpkb, vehiclePlate } from "@/lib/simaset/format";
import type { Asset, Room } from "@/lib/simaset/types";
import { BantenSeal, DishubSeal } from "@/components/brand/seals";
import { KirPlaque } from "./kir-plaque";

export function KirDocument({ room, assets }: { room: Room; assets: Asset[] }) {
  const totalQty = assets.reduce((s, a) => s + a.quantity, 0);
  const year = new Date().getFullYear();

  return (
    <div className="space-y-8 print:space-y-0">
      <KirPlaque room={room} />

      <article className="print-sheet kir-lampiran mx-auto max-w-5xl bg-white text-black">
        <header className="flex items-start gap-4 border-b-2 border-black pb-3">
          <BantenSeal className="size-16 shrink-0 object-contain" />
          <div className="flex-1 text-center">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase">Pemerintah Provinsi Banten</p>
            <h1 className="font-display text-2xl font-semibold">Dinas Perhubungan</h1>
            <p className="text-xs">Lampiran Kartu Inventaris Ruangan · {year}</p>
            <p className="mt-2 font-display text-xl font-semibold tracking-wide">{room.name}</p>
          </div>
          <DishubSeal className="size-16 shrink-0 object-contain" />
        </header>

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
          <Row k="SKPD" v="Dinas Perhubungan Provinsi Banten" />
          <Row k="Nama ruangan" v={room.name} />
          <Row k="Kode lokasi" v={room.code} />
          <Row k="Bidang / unit" v={room.bidangName} />
          <Row k="Sub bidang" v={room.subBidangName ?? "—"} />
          <Row k="Lantai / gedung" v={`${room.floor} · ${room.building}`} />
          <Row k="Penanggung jawab" v={room.picName ?? "—"} />
          <Row k="NIP" v={room.picNip ?? "—"} />
          <Row k="Jumlah barang" v={`${formatNumber(assets.length)} jenis`} />
        </dl>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr>
                {[
                  "No",
                  "Kode barang",
                  "Nama barang",
                  "Merk / type",
                  "No. register",
                  "Bahan",
                  "Thn",
                  "Jml",
                  "Sat",
                  "Ket / kondisi",
                ].map((h) => (
                  <th key={h} className="border border-black px-1.5 py-1 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map((a, i) => (
                <tr key={a.id}>
                  <td className="border border-black px-1.5 py-1">{i + 1}</td>
                  <td className="border border-black px-1.5 py-1 font-mono">{a.kibCode}</td>
                  <td className="border border-black px-1.5 py-1">{displayAssetName(a)}</td>
                  <td className="border border-black px-1.5 py-1">
                    {[a.brand, a.spec].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="border border-black px-1.5 py-1 font-mono">{a.registerNo}</td>
                  <td className="border border-black px-1.5 py-1">{a.material ?? "—"}</td>
                  <td className="border border-black px-1.5 py-1">{a.yearAcquired ?? "—"}</td>
                  <td className="border border-black px-1.5 py-1 tabular-nums">{formatNumber(a.quantity)}</td>
                  <td className="border border-black px-1.5 py-1">{a.unit}</td>
                  <td className="border border-black px-1.5 py-1">
                    {conditionLabel(a.condition)}
                    {a.category === "kendaraan" && vehiclePlate(a.serialNo)
                      ? ` · Plat ${vehiclePlate(a.serialNo)}`
                      : ""}
                    {a.category === "kendaraan" && vehicleBpkb(a.notes)
                      ? ` · BPKB ${vehicleBpkb(a.notes)}`
                      : ""}
                    {a.notes && a.category !== "kendaraan" ? ` · ${a.notes}` : ""}
                  </td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={10} className="border border-black px-2 py-6 text-center">
                    Tidak ada barang pada ruangan ini.
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={7} className="border border-black px-1.5 py-1 text-right font-semibold">
                  Jumlah
                </td>
                <td className="border border-black px-1.5 py-1 font-semibold tabular-nums">
                  {formatNumber(totalQty)}
                </td>
                <td className="border border-black px-1.5 py-1" />
                <td className="border border-black px-1.5 py-1" />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 text-center text-sm">
          <SignBlock title="Pengurus Barang" name="________________" nip="NIP. " />
          <SignBlock
            title="Penanggung Jawab Ruangan"
            name={room.picName ?? "________________"}
            nip={room.picNip ? `NIP. ${room.picNip}` : "NIP. "}
          />
          <SignBlock title="Pengguna Barang" name="Endad Haryanto, SE, M.Si" nip="NIP. 19730403 200112 1 003" />
        </div>
      </article>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-36 shrink-0 text-neutral-600">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function SignBlock({ title, name, nip }: { title: string; name: string; nip: string }) {
  return (
    <div>
      <p>Serang, ………………</p>
      <p className="font-medium">{title}</p>
      <div className="h-16" />
      <p className="font-semibold underline decoration-dotted">{name}</p>
      <p className="text-xs">{nip}</p>
    </div>
  );
}
