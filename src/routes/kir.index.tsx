import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { listRooms } from "@/lib/simaset/server";
import { formatNumber } from "@/lib/simaset/format";

export const Route = createFileRoute("/kir/")({ component: KirIndex });

function KirIndex() {
  return <Page>{() => <KirList />}</Page>;
}

function KirList() {
  const q = useQuery({ queryKey: ["rooms"], queryFn: () => listRooms() });
  const [term, setTerm] = useState("");
  const rooms = useMemo(() => {
    const all = Array.isArray(q.data) ? q.data : [];
    const t = term.trim().toLowerCase();
    if (!t) return all;
    return all.filter((r) =>
      `${r.name} ${r.bidangName} ${r.subBidangName ?? ""} ${r.code}`.toLowerCase().includes(t),
    );
  }, [q.data, term]);

  if (q.isPending) return <Skeleton className="h-64" />;
  if (q.isError) {
    return (
      <p className="text-sm text-destructive">
        Gagal memuat ruangan. Buka Indoor · Kantor, pilih ruang, lalu Cetak KIR dari sana.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Dokumen</p>
          <h1 className="font-display mt-1 text-3xl font-semibold">Kartu Inventaris Ruangan</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Pilih ruangan untuk membuka PDF KIR (plakat + lampiran barang), lalu unduh untuk dicetak.
          </p>
        </div>
        <Input
          className="w-64"
          placeholder="Cari ruangan / bidang…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-3 py-2.5 font-medium">Ruangan</th>
              <th className="px-3 py-2.5 font-medium">Bidang</th>
              <th className="px-3 py-2.5 font-medium">Kode</th>
              <th className="px-3 py-2.5 font-medium">Barang</th>
              <th className="px-3 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/40">
                <td className="px-3 py-2.5 font-medium">
                  <Link to="/kir/$roomId" params={{ roomId: r.id }} className="hover:underline">
                    {r.name}
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {r.bidangName}
                  {r.subBidangName ? ` · ${r.subBidangName}` : ""}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs">{r.code}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatNumber(r.assetCount)}</td>
                <td className="px-3 py-2.5 text-right">
                  <Button size="sm" asChild>
                    <Link to="/kir/$roomId" params={{ roomId: r.id }}>
                      <Printer className="size-3.5" /> Buka KIR
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Belum ada ruangan. Buka{" "}
                  <Link to="/indoor" className="text-accent underline">
                    Indoor · Kantor
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
