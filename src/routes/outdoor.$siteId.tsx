import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Plus } from "lucide-react";
import { useState } from "react";
import { AssetFormDialog } from "@/components/assets/asset-form";
import { AssetTable } from "@/components/assets/asset-table";
import { Page } from "@/components/layout/page";
import { OutdoorMap } from "@/components/topology/outdoor-map";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSite, listSites } from "@/lib/simaset/server";
import { formatNumber, siteTypeLabel } from "@/lib/simaset/format";
import { locationStreetViewUrl } from "@/lib/simaset/geo";
import type { StaffProfile } from "@/lib/simaset/types";

export const Route = createFileRoute("/outdoor/$siteId")({ component: SitePage });

function SitePage() {
  const { siteId } = Route.useParams();
  return <Page>{(staff) => <SiteBody id={siteId} staff={staff} />}</Page>;
}

function SiteBody({ id, staff }: { id: string; staff: StaffProfile }) {
  const q = useQuery({ queryKey: ["site", id], queryFn: () => getSite({ data: { id } }) });
  const sites = useQuery({ queryKey: ["sites"], queryFn: () => listSites() });
  const [open, setOpen] = useState(false);
  if (q.isPending) return <Skeleton className="h-96" />;
  const data = q.data;
  if (!data) return <p>Lokasi tidak ditemukan.</p>;
  const { site, assets } = data;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/outdoor" className="text-xs text-muted-foreground hover:text-foreground">
            ← Outdoor
          </Link>
          <h1 className="font-display mt-2 text-3xl font-semibold">{site.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {siteTypeLabel(site.siteType)} · {site.kabupaten} · {site.kmLabel} · {site.corridor}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{site.description}</p>
          <p className="mt-2 text-sm tabular-nums">
            {formatNumber(site.assetCount)} aset
          </p>
        </div>
        <div className="flex gap-2">
          {locationStreetViewUrl({ lat: site.lat, lng: site.lng, name: site.name }) && (
            <Button variant="outline" asChild>
              <a
                href={locationStreetViewUrl({ lat: site.lat, lng: site.lng, name: site.name }) ?? "#"}
                target="_blank"
                rel="noreferrer"
              >
                Street View <ExternalLink className="size-3.5" />
              </a>
            </Button>
          )}
          {(staff.role === "admin" || staff.role === "operator") && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" /> Tambah
            </Button>
          )}
        </div>
      </div>
      <OutdoorMap sites={sites.data ?? []} activeId={site.id} />
      <AssetTable assets={assets} staff={staff} />
      <AssetFormDialog
        open={open}
        onOpenChange={setOpen}
        defaults={{
          topology: "outdoor",
          outdoorSiteId: site.id,
          category: "perlengkapan_jalan",
          kibGroup: "E",
        }}
      />
    </div>
  );
}
