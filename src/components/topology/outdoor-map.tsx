import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { OutdoorSite } from "@/lib/simaset/types";
import { formatNumber, siteTypeLabel } from "@/lib/simaset/format";
import { SitePinsMap } from "./site-pins-map";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const BANTEN = { minLat: -7.2, maxLat: -5.5, minLng: 105.0, maxLng: 107.0 };

function inBanten(s: OutdoorSite) {
  if (s.lat == null || s.lng == null) return false;
  return s.lat >= BANTEN.minLat && s.lat <= BANTEN.maxLat && s.lng >= BANTEN.minLng && s.lng <= BANTEN.maxLng;
}

export function OutdoorMap({ sites, activeId }: { sites: OutdoorSite[]; activeId?: string }) {
  const mappable = useMemo(
    () => sites.filter((s) => s.assetCount > 0 && inBanten(s)),
    [sites],
  );
  const [selectedId, setSelectedId] = useState(activeId ?? mappable[0]?.id);
  const [q, setQ] = useState("");
  const selected = mappable.find((s) => s.id === selectedId) ?? mappable[0];
  const filtered = mappable.filter((s) => {
    const t = q.trim().toLowerCase();
    if (!t) return true;
    return `${s.name} ${s.kabupaten ?? ""} ${s.corridor ?? ""}`.toLowerCase().includes(t);
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Peta aset outdoor</p>
          <p className="text-sm text-muted-foreground">
            {mappable.length} lokasi dengan geotag di Provinsi Banten. Klik pin untuk melihat titik.
          </p>
        </div>
        <SitePinsMap
          sites={mappable}
          selectedId={selected?.id}
          onSelect={(id) => setSelectedId(id)}
          tall
        />
      </div>

      <Input
        placeholder="Cari ruas, kabupaten, lokasi…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="grid max-h-80 gap-2 overflow-auto sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelectedId(s.id)}
            className={cn(
              "rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:border-accent",
              selectedId === s.id ? "border-accent bg-accent/10" : "border-border bg-card",
            )}
          >
            <p className="font-medium">{s.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {siteTypeLabel(s.siteType)} · {s.kabupaten ?? "Banten"} · {formatNumber(s.assetCount)} aset
            </p>
            {s.lat != null && s.lng != null && (
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {s.lat.toFixed(5)}, {s.lng.toFixed(5)}
              </p>
            )}
            <Link
              to="/outdoor/$siteId"
              params={{ siteId: s.id }}
              className="mt-2 inline-block text-xs text-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Detail lokasi
            </Link>
          </button>
        ))}
      </div>
    </div>
  );
}
