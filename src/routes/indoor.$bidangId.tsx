import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBidang } from "@/lib/simaset/server";
import { formatNumber, siteTypeLabel } from "@/lib/simaset/format";
import type { StaffProfile } from "@/lib/simaset/types";

export const Route = createFileRoute("/indoor/$bidangId")({
  component: BidangPage,
  validateSearch: (s: Record<string, unknown>) => ({
    seksi: typeof s.seksi === "string" ? s.seksi : undefined,
  }),
});

function BidangPage() {
  const { bidangId } = Route.useParams();
  const { seksi } = Route.useSearch();
  return <Page>{(staff) => <BidangBody id={bidangId} seksi={seksi} staff={staff} />}</Page>;
}

function BidangBody({
  id,
  seksi,
}: {
  id: string;
  seksi?: string;
  staff: StaffProfile;
}) {
  const q = useQuery({ queryKey: ["bidang", id], queryFn: () => getBidang({ data: { id } }) });
  if (q.isPending) return <Skeleton className="h-96" />;
  const data = q.data;
  if (!data) return <p>Unit kerja tidak ditemukan.</p>;
  const { bidang, subs, rooms, sites } = data;
  const activeSub = seksi ? subs.find((s) => s.id === seksi) : undefined;
  const visibleRooms = seksi ? rooms.filter((r) => r.subBidangId === seksi) : rooms;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/indoor" className="text-xs text-muted-foreground hover:text-foreground">
          ← Indoor
        </Link>
        {activeSub ? (
          <p className="mt-2">
            <Link
              to="/indoor/$bidangId"
              params={{ bidangId: id }}
              search={{ seksi: undefined }}
              className="text-xs text-accent hover:underline"
            >
              {bidang.name}
            </Link>
          </p>
        ) : null}
        <h1 className="font-display mt-2 text-3xl font-semibold">{activeSub?.name ?? bidang.name}</h1>
        {(activeSub?.headName ?? bidang.headName) ? (
          <p className="mt-1 text-sm">
            {activeSub?.headName ?? bidang.headName}
            {(activeSub?.headNip ?? bidang.headNip) ? (
              <span className="text-muted-foreground"> · NIP {activeSub?.headNip ?? bidang.headNip}</span>
            ) : null}
          </p>
        ) : null}
        {!activeSub ? <p className="mt-1 text-sm text-muted-foreground">{bidang.description}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>{bidang.floor}</Badge>
          <Badge variant="muted">{visibleRooms.length} ruangan</Badge>
          <Badge variant="muted">{sites.length} lokasi</Badge>
          <Badge variant="accent">{formatNumber(bidang.indoorCount)} indoor</Badge>
          <Badge variant="accent">{formatNumber(bidang.outdoorCount)} outdoor</Badge>
        </div>
      </div>

      {!activeSub && subs.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-semibold">Sub bidang / seksi</h2>
          <p className="mt-1 text-xs text-muted-foreground">Klik untuk membuka ruangan seksi tersebut.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {subs.map((s) => (
              <Link key={s.id} to="/indoor/$bidangId" params={{ bidangId: id }} search={{ seksi: s.id }}>
                <Card className="h-full hover:border-accent">
                  <CardHeader>
                    <CardTitle className="text-base">{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    <p>{s.headTitle}</p>
                    {s.headName ? <p className="mt-1 font-medium text-foreground">{s.headName}</p> : null}
                    {s.headNip ? <p className="mt-0.5 font-mono">{s.headNip}</p> : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-display text-lg font-semibold">Ruangan kantor</h2>
        <p className="mt-1 mb-3 text-xs text-muted-foreground">Klik ruangan untuk membuka aset di dalamnya.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRooms.map((room) => (
            <Link key={room.id} to="/rooms/$roomId" params={{ roomId: room.id }}>
              <Card className="h-full hover:border-accent">
                <CardContent className="p-5">
                  <p className="text-sm font-medium">{room.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{room.code}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {room.subBidangName ?? "Unit pimpinan"} · {room.floor}
                  </p>
                  <p className="mt-3 text-sm tabular-nums">
                    {formatNumber(room.assetCount)} barang
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {visibleRooms.length === 0 && (
            <p className="text-sm text-muted-foreground">Belum ada ruangan pada unit ini.</p>
          )}
        </div>
      </div>

      {!activeSub && (
        <div>
          <h2 className="font-display text-lg font-semibold">Lokasi outdoor</h2>
          <p className="mt-1 mb-3 text-xs text-muted-foreground">
            Klik lokasi untuk membuka aset geotag di titik tersebut.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <Link key={site.id} to="/outdoor/$siteId" params={{ siteId: site.id }}>
                <Card className="h-full hover:border-accent">
                  <CardContent className="p-5">
                    <p className="text-sm font-medium">{site.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {siteTypeLabel(site.siteType)} · {site.kabupaten ?? "Banten"}
                    </p>
                    <p className="mt-3 text-sm tabular-nums">{formatNumber(site.assetCount)} barang</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {sites.length === 0 && (
              <p className="text-sm text-muted-foreground">Belum ada lokasi outdoor pada unit ini.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
