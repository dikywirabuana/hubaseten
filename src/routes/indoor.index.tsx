import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/layout/page";
import { IndoorPlan } from "@/components/topology/indoor-plan";
import { OrgChart } from "@/components/topology/org-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listBidangs, listRooms, listSites, listSubBidangs } from "@/lib/simaset/server";
import { formatNumber } from "@/lib/simaset/format";

export const Route = createFileRoute("/indoor/")({ component: IndoorPage });

function IndoorPage() {
  return (
    <Page>
      {() => <IndoorBody />}
    </Page>
  );
}

function IndoorBody() {
  const bidangs = useQuery({ queryKey: ["bidangs"], queryFn: () => listBidangs() });
  const rooms = useQuery({ queryKey: ["rooms"], queryFn: () => listRooms() });
  const sites = useQuery({ queryKey: ["sites"], queryFn: () => listSites() });
  const subs = useQuery({ queryKey: ["sub-bidangs"], queryFn: () => listSubBidangs() });
  if (bidangs.isPending || rooms.isPending || subs.isPending) return <Skeleton className="h-96" />;
  const b = bidangs.data ?? [];
  const r = rooms.data ?? [];
  const s = sites.data ?? [];
  const visible = b.filter((x) => x.kind !== "fungsional");
  const parkir = r.find((x) => x.id === "room-parkir");
  const pamdal = r.find((x) => x.id === "room-pamdal");
  const posKa = s.find((x) => x.id === "site-pos-pelintasan");
  const posJaga = s.find((x) => x.id === "site-pos-jaga");
  const gudang = r.find((x) => x.id === "room-gudang-atk");
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Topologi indoor</p>
        <h1 className="font-display mt-1 text-3xl font-semibold">Kantor per bidang</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Setiap bidang punya ruangan kantor dan lokasi operasional. Klik kartu untuk membuka daftar
          ruang/lokasi, lalu klik ruang atau lokasi untuk melihat asetnya.
        </p>
      </div>
      <OrgChart bidangs={b} subs={subs.data ?? []} />

      <div>
        <h2 className="font-display text-lg font-semibold">Lokasi cepat</h2>
        <p className="mt-1 mb-3 text-xs text-muted-foreground">
          Kendaraan di parkiran, pos pamdal di halaman, pos pelintasan KA di lapangan.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {parkir ? (
            <Link to="/rooms/$roomId" params={{ roomId: parkir.id }}>
              <Card className="h-full hover:border-accent">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground uppercase">Halaman · Sekretariat</p>
                  <p className="mt-1 font-medium">Parkiran · kendaraan</p>
                  <p className="mt-2 text-xs tabular-nums text-muted-foreground">
                    {formatNumber(parkir.assetCount)} aset
                  </p>
                </CardContent>
              </Card>
            </Link>
          ) : null}
          {pamdal ? (
            <Link to="/rooms/$roomId" params={{ roomId: pamdal.id }}>
              <Card className="h-full hover:border-accent">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground uppercase">Halaman · Sekretariat</p>
                  <p className="mt-1 font-medium">Pos pamdal</p>
                  <p className="mt-2 text-xs tabular-nums text-muted-foreground">
                    {formatNumber(pamdal.assetCount)} aset
                  </p>
                </CardContent>
              </Card>
            </Link>
          ) : null}
          {posKa ? (
            <Link to="/outdoor/$siteId" params={{ siteId: posKa.id }}>
              <Card className="h-full hover:border-accent">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground uppercase">Outdoor · Laut Udara KA</p>
                  <p className="mt-1 font-medium">Pos pelintasan KA</p>
                  <p className="mt-2 text-xs tabular-nums text-muted-foreground">
                    {formatNumber(posKa.assetCount)} aset
                  </p>
                </CardContent>
              </Card>
            </Link>
          ) : null}
          {posJaga ? (
            <Link to="/outdoor/$siteId" params={{ siteId: posJaga.id }}>
              <Card className="h-full hover:border-accent">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground uppercase">Outdoor · Laut Udara KA</p>
                  <p className="mt-1 font-medium">Pos jaga jalan</p>
                  <p className="mt-2 text-xs tabular-nums text-muted-foreground">
                    {formatNumber(posJaga.assetCount)} aset
                  </p>
                </CardContent>
              </Card>
            </Link>
          ) : null}
          {gudang ? (
            <Link to="/rooms/$roomId" params={{ roomId: gudang.id }}>
              <Card className="h-full hover:border-accent">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground uppercase">Lantai 1 · Sekretariat</p>
                  <p className="mt-1 font-medium">{gudang.name}</p>
                  <p className="mt-2 text-xs tabular-nums text-muted-foreground">
                    {formatNumber(gudang.assetCount)} aset
                  </p>
                </CardContent>
              </Card>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((bid) => (
          <Link key={bid.id} to="/indoor/$bidangId" params={{ bidangId: bid.id }} search={{ seksi: undefined }}>
            <Card className="h-full hover:border-accent">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{bid.floor}</p>
                <p className="mt-1 font-medium">{bid.shortName}</p>
                {bid.headName ? (
                  <p className="mt-1 text-xs text-muted-foreground">{bid.headName}</p>
                ) : null}
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{bid.name}</p>
                <p className="mt-3 text-xs tabular-nums text-muted-foreground">
                  {bid.roomCount} ruang · {bid.siteCount} lokasi
                </p>
                <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                  {formatNumber(bid.indoorCount)} indoor · {formatNumber(bid.outdoorCount)} outdoor
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <IndoorPlan bidangs={visible} rooms={r} />
    </div>
  );
}
