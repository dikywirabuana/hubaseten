import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/layout/page";
import { NetworkMap } from "@/components/topology/network-map";
import { Skeleton } from "@/components/ui/skeleton";
import { listSites } from "@/lib/simaset/server";
import { Route as OutdoorRoute } from "./outdoor";

export const Route = createFileRoute("/outdoor/")({ component: OutdoorPage });

function OutdoorPage() {
  return <Page>{() => <OutdoorBody />}</Page>;
}

function OutdoorBody() {
  const { lihat } = OutdoorRoute.useSearch();
  const q = useQuery({ queryKey: ["sites"], queryFn: () => listSites() });
  if (q.isPending) return <Skeleton className="h-96" />;
  const title =
    lihat === "ruas"
      ? "93 ruas jalan provinsi"
      : lihat === "titik"
        ? "Titik perlengkapan lapangan"
        : lihat === "kib"
          ? "Lokasi aset outdoor KIB"
          : "Perlengkapan jalan";
  const subtitle =
    lihat === "ruas"
      ? "Daftar ruas dari peta Dishub. Klik nama ruas untuk menandai di peta."
      : lihat === "titik"
        ? "Rambu, PJU, APILL, marka, dan APPJ hasil pemetaan lapangan."
        : lihat === "kib"
          ? "Lokasi KIB yang sudah dikelompokkan per ruas/sekolah/pos. Klik untuk daftar aset."
          : "Jaringan ruas provinsi, titik rambu/PJU lapangan, dan lokasi KIB.";
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Topologi outdoor</p>
        <h1 className="font-display mt-1 text-3xl font-semibold">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <NetworkMap sites={q.data ?? []} tall focus={lihat} />
    </div>
  );
}
