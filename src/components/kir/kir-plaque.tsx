import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { Room } from "@/lib/simaset/types";
import { BantenSeal, DishubSeal } from "@/components/brand/seals";

function roomHeadline(room: Room): string {
  const raw = room.name.replace(/^ruang(an)?\s+/i, "").trim();
  return `RUANGAN ${raw.toUpperCase()}`;
}

export function KirPlaque({ room }: { room: Room }) {
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    const url = `${window.location.origin}/kir/${room.id}`;
    void QRCode.toDataURL(url, {
      width: 360,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#111111", light: "#ffffff" },
    }).then(setQr);
  }, [room.id]);

  return (
    <article className="kir-plaque relative overflow-hidden bg-[#f3f5f7] text-[#1a1a1a]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden>
        <path d="M0 0 H220 L150 90 H0 Z" fill="#1e4d86" opacity="0.12" />
        <path d="M1000 0 L1000 210 L780 0 Z" fill="#163a6a" />
        <path d="M1000 0 L1000 150 L840 0 Z" fill="#2a5f9a" />
        <path d="M1000 40 L1000 250 L720 40 Z" fill="#1e4d86" opacity="0.35" />
        <path d="M0 640 L280 640 L0 430 Z" fill="#163a6a" />
        <path d="M0 640 L190 640 L0 500 Z" fill="#2a5f9a" />
        <path d="M40 640 L320 640 L40 470 Z" fill="#1e4d86" opacity="0.28" />
        <path d="M18 18 H210" stroke="#1e4d86" strokeWidth="2.2" fill="none" />
        <path d="M18 18 V150" stroke="#1e4d86" strokeWidth="2.2" fill="none" />
        <path d="M982 622 H790" stroke="#1e4d86" strokeWidth="2.2" fill="none" />
        <path d="M982 622 V490" stroke="#1e4d86" strokeWidth="2.2" fill="none" />
        <path d="M70 18 L210 18 L160 70" stroke="#7ea3d4" strokeWidth="1.2" fill="none" />
        <path d="M930 80 L1000 20" stroke="white" strokeWidth="6" opacity="0.35" />
        <path d="M860 40 L1000 90" stroke="white" strokeWidth="3" opacity="0.25" />
      </svg>

      <div className="relative z-10 flex h-full flex-col px-8 py-6 sm:px-12">
        <div className="flex items-start justify-between gap-4">
          <BantenSeal className="size-20 shrink-0 object-contain sm:size-24" />
          <div className="min-w-0 flex-1 pt-2 text-center">
            <h1 className="font-display text-2xl font-semibold tracking-[0.12em] text-[#8a7344] uppercase sm:text-4xl">
              Barang milik daerah
            </h1>
            <p className="font-display mt-1 text-xl font-semibold tracking-[0.14em] text-[#8a7344] uppercase sm:text-3xl">
              Dinas Perhubungan
            </p>
          </div>
          <DishubSeal className="size-20 shrink-0 object-contain sm:size-24" />
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#b42318] uppercase">
            Kartu inventaris ruangan
          </p>
          <p className="mt-2 text-sm font-semibold tracking-[0.12em] uppercase sm:text-base">
            {roomHeadline(room)}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center py-4">
          {qr ? (
            <img src={qr} alt={`QR inventaris ${room.name}`} className="size-44 bg-white p-2 sm:size-52" />
          ) : (
            <div className="size-44 bg-white sm:size-52" />
          )}
        </div>
      </div>
    </article>
  );
}
