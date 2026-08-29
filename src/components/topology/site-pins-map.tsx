import { useEffect, useRef } from "react";
import type { OutdoorSite } from "@/lib/simaset/types";
import { formatNumber, siteTypeLabel } from "@/lib/simaset/format";
import { locationStreetViewUrl } from "@/lib/simaset/geo";

type LeafletNS = typeof import("leaflet");

function escapeHtml(value: string): string {
  return [...value]
    .map((ch) => {
      if (ch === "&") return "&" + "amp;";
      if (ch === "<") return "&" + "lt;";
      if (ch === ">") return "&" + "gt;";
      if (ch === '"') return "&" + "quot;";
      return ch;
    })
    .join("");
}

function pinIcon(L: LeafletNS, index: number, active: boolean) {
  return L.divIcon({
    className: "simaset-pin-wrap",
    html: `<div class="simaset-pin${active ? " is-active" : ""}">${index + 1}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

export function SitePinsMap({
  sites,
  selectedId,
  onSelect,
  tall,
}: {
  sites: OutdoorSite[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  tall?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const leafletRef = useRef<LeafletNS | null>(null);

  const plottable = sites.filter((s) => s.lat != null && s.lng != null);
  const plottableRef = useRef(plottable);
  plottableRef.current = plottable;
  const key = plottable.map((s) => `${s.id}:${s.lat}:${s.lng}:${s.assetCount}`).join("|");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || plottable.length === 0) return;
    let cancelled = false;

    void (async () => {
      const leafletMod = await import("leaflet");
      const L = ((leafletMod as { default?: LeafletNS }).default ?? leafletMod) as LeafletNS;
      leafletRef.current = L;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, { scrollWheelZoom: false });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      const bounds: import("leaflet").LatLngExpression[] = [];
      const markers = new Map<string, import("leaflet").Marker>();
      plottable.forEach((site, index) => {
        const lat = site.lat as number;
        const lng = site.lng as number;
        bounds.push([lat, lng]);
        const street = locationStreetViewUrl({ lat, lng, name: site.name }) ?? "#";
        const marker = L.marker([lat, lng], { icon: pinIcon(L, index, site.id === selectedId) }).addTo(map);
        marker.bindPopup(
          `<div class="simaset-popup">
            <p class="simaset-popup-title">${escapeHtml(site.name)}</p>
            <p class="simaset-popup-meta">${escapeHtml(siteTypeLabel(site.siteType))} · ${escapeHtml(site.kabupaten ?? "")} · ${formatNumber(site.assetCount)} aset</p>
            <p class="simaset-popup-meta">${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
            <p class="simaset-popup-actions">
              <a href="${street}" target="_blank" rel="noreferrer">Street View</a>
              · <a href="/outdoor/${escapeHtml(site.id)}">Detail lokasi</a>
            </p>
          </div>`,
        );
        marker.on("click", () => onSelectRef.current?.(site.id));
        markers.set(site.id, marker);
      });
      markersRef.current = markers;
      map.fitBounds(bounds as import("leaflet").LatLngBoundsExpression, { padding: [36, 36], maxZoom: 12 });
      const current = selectedId ? markers.get(selectedId) : undefined;
      current?.openPopup();
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = new Map();
    };
    // selectedId applied after mount via the second effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    plottableRef.current.forEach((site, index) => {
      const marker = markersRef.current.get(site.id);
      if (!marker) return;
      marker.setIcon(pinIcon(L, index, site.id === selectedId));
    });
    const current = selectedId ? plottableRef.current.find((s) => s.id === selectedId) : undefined;
    if (current?.lat != null && current.lng != null) {
      map.flyTo([current.lat, current.lng], Math.max(map.getZoom(), 12), { duration: 0.4 });
      markersRef.current.get(current.id)?.openPopup();
    }
  }, [selectedId]);

  if (plottable.length === 0) {
    return (
      <div className="grid h-96 place-items-center rounded-lg bg-muted text-sm text-muted-foreground">
        Koordinat lokasi belum tersedia.
      </div>
    );
  }

  return <div ref={containerRef} className={tall ? "simaset-map h-[min(72vh,760px)] w-full" : "simaset-map h-96 w-full"} />;
}
