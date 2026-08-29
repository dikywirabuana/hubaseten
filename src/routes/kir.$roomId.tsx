import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { StaffGate } from "@/components/layout/staff-gate";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoom } from "@/lib/simaset/server";
import { buildKirPdf, kirFilename } from "@/lib/simaset/kir-pdf";

export const Route = createFileRoute("/kir/$roomId")({ component: KirPrint });

function KirPrint() {
  const { roomId } = Route.useParams();
  return (
    <StaffGate>
      {() => <KirBody id={roomId} />}
    </StaffGate>
  );
}

function KirBody({ id }: { id: string }) {
  const q = useQuery({ queryKey: ["room", id], queryFn: () => getRoom({ data: { id } }) });
  const [pdfUrl, setPdfUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!q.data) return;
    let revoked = "";
    let cancelled = false;
    setBusy(true);
    void (async () => {
      try {
        const qr = await QRCode.toDataURL(`${window.location.origin}/kir/${q.data!.room.id}`, {
          width: 360,
          margin: 1,
          errorCorrectionLevel: "M",
        });
        const blob = await buildKirPdf(q.data!.room, q.data!.assets, qr);
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        revoked = url;
        setPdfUrl(url);
      } catch (err) {
        console.error(err);
        toast.error("Gagal menyusun PDF KIR.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [q.data]);

  if (q.isPending) return <Skeleton className="h-96" />;
  if (q.isError) {
    return (
      <main className="p-8">
        <p className="text-sm text-destructive">Gagal memuat data ruangan.</p>
        <Link to="/kir" className="mt-3 inline-block text-sm underline">
          Kembali ke daftar
        </Link>
      </main>
    );
  }
  const data = q.data;
  if (!data) return <p className="p-8">Ruangan tidak ditemukan.</p>;

  return (
    <main className="flex min-h-dvh flex-col bg-[#ece7dc]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
        <div>
          <Link to="/kir" className="text-sm text-muted-foreground hover:text-foreground">
            ← Daftar ruangan
          </Link>
          <p className="font-medium">{data.room.name}</p>
          <p className="text-xs text-muted-foreground">
            PDF KIR (plakat + lampiran). Unduh, lalu buka di aplikasi PDF untuk dicetak.
          </p>
        </div>
        {pdfUrl ? (
          <Button asChild>
            <a href={pdfUrl} download={kirFilename(data.room)}>
              <Download className="size-4" /> Unduh PDF KIR
            </a>
          </Button>
        ) : (
          <Button disabled>{busy ? "Menyusun PDF…" : "Unduh PDF KIR"}</Button>
        )}
      </div>
      <div className="min-h-0 flex-1 p-3">
        {pdfUrl ? (
          <iframe title="KIR PDF" src={pdfUrl} className="h-[calc(100dvh-5.5rem)] w-full rounded-lg border border-border bg-white" />
        ) : (
          <p className="p-8 text-sm text-muted-foreground">Menyusun PDF kartu inventaris ruangan…</p>
        )}
      </div>
    </main>
  );
}
