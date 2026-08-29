import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { conditionLabel, displayAssetName, formatNumber, vehicleBpkb, vehiclePlate } from "./format";
import type { Asset, Room } from "./types";

async function asDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function roomTitle(room: Room): string {
  return `RUANGAN ${room.name.replace(/^ruang(an)?\s+/i, "").trim().toUpperCase()}`;
}

export async function buildKirPdf(room: Room, assets: Asset[], qr: string): Promise<Blob> {
  const [banten, dishub] = await Promise.all([
    asDataUrl("/brand/lambang-banten.png"),
    asDataUrl("/brand/lambang-perhubungan.png"),
  ]);
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setFillColor(243, 245, 247);
  doc.rect(0, 0, w, h, "F");
  doc.setDrawColor(30, 77, 134);
  doc.setLineWidth(0.6);
  doc.rect(8, 8, w - 16, h - 16);

  if (banten) doc.addImage(banten, "PNG", 16, 14, 28, 28);
  if (dishub) doc.addImage(dishub, "PNG", w - 44, 14, 28, 28);

  doc.setTextColor(138, 115, 68);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("BARANG MILIK DAERAH", w / 2, 24, { align: "center" });
  doc.setFontSize(16);
  doc.text("DINAS PERHUBUNGAN", w / 2, 34, { align: "center" });

  doc.setTextColor(180, 35, 24);
  doc.setFontSize(11);
  doc.text("KARTU INVENTARIS RUANGAN", w / 2, 52, { align: "center" });

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(22);
  doc.text(roomTitle(room), w / 2, 68, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  const lines = [
    `${room.building} · ${room.floor} · Kode ${room.code}`,
    `${room.bidangName}${room.subBidangName ? ` · ${room.subBidangName}` : ""}`,
    `Penanggung jawab: ${room.picName ?? "—"}${room.picNip ? ` · NIP. ${room.picNip}` : ""}`,
    `Pemerintah Provinsi Banten · Tahun ${new Date().getFullYear()}`,
  ];
  lines.forEach((line, i) => doc.text(line, w / 2, 82 + i * 7, { align: "center" }));

  if (qr) doc.addImage(qr, "PNG", w - 48, h - 50, 32, 32);

  doc.addPage();
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text(`Lampiran KIR · ${room.name}`, 14, 16);
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text(
    `SKPD Dinas Perhubungan Provinsi Banten · ${room.bidangName} · ${formatNumber(assets.length)} jenis barang`,
    14,
    23,
  );

  autoTable(doc, {
    startY: 28,
    head: [["No", "Kode", "Nama barang", "Merk / type", "Register", "Thn", "Jml", "Sat", "Kondisi"]],
    body: assets.map((a, i) => {
      const ket = [
        conditionLabel(a.condition),
        a.category === "kendaraan" && vehiclePlate(a.serialNo) ? `Plat ${vehiclePlate(a.serialNo)}` : "",
        a.category === "kendaraan" && vehicleBpkb(a.notes) ? `BPKB ${vehicleBpkb(a.notes)}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      return [
        String(i + 1),
        a.kibCode,
        displayAssetName(a),
        [a.brand, a.spec].filter(Boolean).join(" · ") || "—",
        a.registerNo,
        a.yearAcquired ? String(a.yearAcquired) : "—",
        formatNumber(a.quantity),
        a.unit,
        ket || "—",
      ];
    }),
    styles: { font: "times", fontSize: 8, cellPadding: 1.2 },
    headStyles: { fillColor: [22, 58, 74], textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 10 },
      5: { cellWidth: 14 },
      6: { cellWidth: 14 },
      7: { cellWidth: 14 },
    },
    margin: { left: 12, right: 12 },
  });

  const y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 160;
  const signY = Math.min(y + 18, h - 28);
  doc.setFontSize(10);
  const col = w / 4;
  [
    ["Pengurus Barang", "________________", "NIP."],
    ["Penanggung Jawab Ruangan", room.picName ?? "________________", room.picNip ? `NIP. ${room.picNip}` : "NIP."],
    ["Pengguna Barang", "Endad Haryanto, SE, M.Si", "NIP. 19730403 200112 1 003"],
  ].forEach((block, i) => {
    const x = col * (i + 1);
    doc.text(block[0], x, signY, { align: "center" });
    doc.text(block[1], x, signY + 16, { align: "center" });
    doc.text(block[2], x, signY + 22, { align: "center" });
  });

  return doc.output("blob");
}

export function kirFilename(room: Room): string {
  const slug = room.name.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `KIR-${slug || room.id}.pdf`;
}
