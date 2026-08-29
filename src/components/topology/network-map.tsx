import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { OutdoorSite } from "@/lib/simaset/types";
import { formatNumber, siteTypeLabel } from "@/lib/simaset/format";
import { googleStreetViewUrl, locationStreetViewUrl } from "@/lib/simaset/geo";
import { loadJaringan, type JaringanData, type TitikProperties } from "@/lib/simaset/jaringan";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { cn } from "@/lib/utils";

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

const BANTEN = { minLat: -7.2, maxLat: -5.5, minLng: 105.0, maxLng: 107.0 };

function inBanten(s: OutdoorSite) {
  if (s.lat == null || s.lng == null) return false;
  return s.lat >= BANTEN.minLat && s.lat <= BANTEN.maxLat && s.lng >= BANTEN.minLng && s.lng <= BANTEN.maxLng;
}

function normKab(value: string) {
  return value
    .toUpperCase()
    .replace(/KABUPATEN|KOTA|KAB\.?/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pinClass(kind: string) {
  const k = kind.toUpperCase();
  if (k.includes("PJU") || k.includes("LAMPU")) return "simaset-dot simaset-dot-pju";
  if (k.includes("RAMBU")) return "simaset-dot simaset-dot-rambu";
  if (k.includes("APILL")) return "simaset-dot simaset-dot-apill";
  if (k.includes("MARKA")) return "simaset-dot simaset-dot-marka";
  return "simaset-dot simaset-dot-appj";
}

type Selection =
  | { kind: "ruas"; id: string; name: string; kabupaten: string; lat: number; lng: number }
  | { kind: "titik"; id: string; props: TitikProperties; lat: number; lng: number }
  | { kind: "kib"; site: OutdoorSite };

export function NetworkMap({
  sites,
  tall,
  focus,
}: {
  sites: OutdoorSite[];
  tall?: boolean;
  focus?: "ruas" | "titik" | "kib";
}) {
  const [data, setData] = useState<JaringanData | null>(null);
  const [kabupaten, setKabupaten] = useState("semua");
  const [q, setQ] = useState("");
  const [showRuas, setShowRuas] = useState(focus !== "titik" && focus !== "kib");
  const [showTitik, setShowTitik] = useState(focus !== "ruas" && focus !== "kib");
  const [showKib, setShowKib] = useState(focus === "kib");
  const [selected, setSelected] = useState<Selection | null>(null);

  useEffect(() => {
    void loadJaringan().then(setData);
  }, []);

  useEffect(() => {
    if (!focus) return;
    setShowRuas(focus === "ruas");
    setShowTitik(focus === "titik");
    setShowKib(focus === "kib");
  }, [focus]);

  const kibSites = useMemo(
    () => sites.filter((s) => s.assetCount > 0 && inBanten(s)),
    [sites],
  );

  const kabList = data?.meta.kabupaten.map((k) => k.name) ?? [];

  const filteredRuas = useMemo(() => {
    if (!data) return [];
    const term = q.trim().toLowerCase();
    return data.ruas.features.filter((f) => {
      if (kabupaten !== "semua" && f.properties.kabupaten !== kabupaten) return false;
      if (!term) return true;
      return `${f.properties.name} ${f.properties.kabupaten}`.toLowerCase().includes(term);
    });
  }, [data, kabupaten, q]);

  const filteredTitik = useMemo(() => {
    if (!data) return [];
    const term = q.trim().toLowerCase();
    return data.titik.features.filter((f) => {
      if (kabupaten !== "semua" && f.properties.kabupaten !== kabupaten) return false;
      if (!term) return true;
      return `${f.properties.ruas} ${f.properties.jenis} ${f.properties.perlengkapan}`.toLowerCase().includes(term);
    });
  }, [data, kabupaten, q]);

  const filteredKib = useMemo(() => {
    const term = q.trim().toLowerCase();
    const needle = normKab(kabupaten);
    return kibSites.filter((s) => {
      if (kabupaten !== "semua" && !normKab(s.kabupaten ?? "").includes(needle)) return false;
      if (!term) return true;
      return `${s.name} ${s.kabupaten ?? ""} ${s.corridor ?? ""}`.toLowerCase().includes(term);
    });
  }, [kibSites, kabupaten, q]);

  const listKind: "ruas" | "titik" | "kib" =
    focus ?? (showKib && !showRuas ? "kib" : showTitik && !showRuas ? "titik" : "ruas");

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-end gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Dashboard Maps</p>
          <p className="text-sm text-foreground">
            {data ? `${data.meta.ruas} ruas provinsi` : "Memuat jaringan…"}
            {data ? ` · ${data.meta.titik} titik lapangan` : ""}
            {` · ${kibSites.length} lokasi KIB`}
          </p>
        </div>
        <SelectField
          className="w-52"
          value={kabupaten}
          onChange={(e) => setKabupaten(e.target.value)}
          aria-label="Wilayah kabupaten"
        >
          <option value="semua">Seluruh ruas jalan</option>
          {kabList.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </SelectField>
        <Input
          className="w-56"
          placeholder="Cari ruas / rambu / PJU…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border px-4 py-2 text-xs">
        <LayerToggle label="Jaringan jalan" checked={showRuas} onChange={setShowRuas} swatch="ruas" />
        <LayerToggle label="Perlengkapan lapangan" checked={showTitik} onChange={setShowTitik} swatch="titik" />
        <LayerToggle label="Lokasi KIB" checked={showKib} onChange={setShowKib} swatch="kib" />
      </div>

      <LeafletNetwork
        ruas={showRuas ? filteredRuas : []}
        titik={showTitik ? filteredTitik : []}
        kib={showKib ? filteredKib : []}
        selected={selected}
        onSelect={setSelected}
        tall={tall}
      />

      {selected ? <SelectionBar selection={selected} /> : null}

      <div className="grid max-h-[28rem] gap-1 overflow-auto border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {listKind === "ruas"
          ? filteredRuas.map((f) => (
              <button
                key={f.properties.id}
                type="button"
                className={cn(
                  "px-3 py-2 text-left text-sm hover:bg-muted",
                  selected?.kind === "ruas" && selected.id === f.properties.id && "bg-accent/10",
                )}
                onClick={() => {
                  const mid = midpoint(f.geometry.coordinates);
                  setSelected({
                    kind: "ruas",
                    id: f.properties.id,
                    name: f.properties.name,
                    kabupaten: f.properties.kabupaten,
                    lat: mid[0],
                    lng: mid[1],
                  });
                }}
              >
                <p className="font-medium">{f.properties.name}</p>
                <p className="text-xs text-muted-foreground">{f.properties.kabupaten}</p>
              </button>
            ))
          : null}
        {listKind === "titik"
          ? filteredTitik.map((f) => (
              <button
                key={f.properties.id}
                type="button"
                className={cn(
                  "px-3 py-2 text-left text-sm hover:bg-muted",
                  selected?.kind === "titik" && selected.id === f.properties.id && "bg-accent/10",
                )}
                onClick={() => {
                  const [lng, lat] = f.geometry.coordinates;
                  setSelected({ kind: "titik", id: f.properties.id, props: f.properties, lat, lng });
                }}
              >
                <p className="font-medium">
                  {f.properties.perlengkapan} · {f.properties.jenis}
                </p>
                <p className="text-xs text-muted-foreground">
                  {f.properties.ruas} · {f.properties.kabupaten}
                </p>
              </button>
            ))
          : null}
        {listKind === "kib"
          ? filteredKib.map((s) => (
              <Link
                key={s.id}
                to="/outdoor/$siteId"
                params={{ siteId: s.id }}
                className="px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {siteTypeLabel(s.siteType)} · {s.kabupaten ?? "Banten"} · {formatNumber(s.assetCount)} aset
                </p>
              </Link>
            ))
          : null}
      </div>
    </div>
  );
}

function LayerToggle({
  label,
  checked,
  onChange,
  swatch,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  swatch: "ruas" | "titik" | "kib";
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-2 py-1.5">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={cn("size-2.5 rounded-full", `simaset-swatch-${swatch}`)} />
      {label}
    </label>
  );
}

function SelectionBar({ selection }: { selection: Selection }) {
  if (selection.kind === "ruas") {
    const street = googleStreetViewUrl(selection.lat, selection.lng);
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Ruas jalan provinsi</p>
          <p className="font-medium">{selection.name}</p>
          <p className="text-xs text-muted-foreground">{selection.kabupaten}</p>
        </div>
        <a
          href={street}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        >
          Buka Street View
        </a>
      </div>
    );
  }
  if (selection.kind === "titik") {
    const street = googleStreetViewUrl(selection.lat, selection.lng);
    const p = selection.props;
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {p.perlengkapan} · {p.kategori}
          </p>
          <p className="font-medium">{p.jenis}</p>
          <p className="text-xs text-muted-foreground">
            {p.ruas} · {p.kabupaten} · {p.kondisi}
          </p>
        </div>
        <a
          href={street}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
        >
          Buka Street View
        </a>
      </div>
    );
  }
  const s = selection.site;
  const street = locationStreetViewUrl({ lat: s.lat, lng: s.lng, name: s.name });
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
      <div>
        <p className="text-xs tracking-wide text-muted-foreground uppercase">Lokasi KIB</p>
        <p className="font-medium">{s.name}</p>
        <p className="text-xs text-muted-foreground">
          {siteTypeLabel(s.siteType)} · {s.kabupaten ?? "Banten"} · {formatNumber(s.assetCount)} aset
        </p>
      </div>
      <div className="flex gap-2">
        {street ? (
          <a
            href={street}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
          >
            Street View
          </a>
        ) : null}
        <Link
          to="/outdoor/$siteId"
          params={{ siteId: s.id }}
          className="rounded-md border border-border px-3 py-2 text-sm"
        >
          Detail lokasi
        </Link>
      </div>
    </div>
  );
}

function midpoint(lines: number[][][]): [number, number] {
  const pts = lines.flat();
  const mid = pts[Math.floor(pts.length / 2)] ?? pts[0] ?? [106.15, -6.12];
  return [mid[1], mid[0]];
}

function LeafletNetwork({
  ruas,
  titik,
  kib,
  selected,
  onSelect,
  tall,
}: {
  ruas: JaringanData["ruas"]["features"];
  titik: JaringanData["titik"]["features"];
  kib: OutdoorSite[];
  selected: Selection | null;
  onSelect: (s: Selection) => void;
  tall?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layersRef = useRef<import("leaflet").LayerGroup | null>(null);
  const leafletRef = useRef<LeafletNS | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const [ready, setReady] = useState(0);

  const key = [
    ruas.map((f) => f.properties.id).join(","),
    titik.map((f) => f.properties.id).join(","),
    kib.map((s) => s.id).join(","),
    String(ready),
  ].join("|");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    void (async () => {
      const leafletMod = await import("leaflet");
      const L = ((leafletMod as { default?: LeafletNS }).default ?? leafletMod) as LeafletNS;
      leafletRef.current = L;
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, { scrollWheelZoom: true, zoomControl: true });
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);
      map.setView([-6.25, 106.15], 9);
      layersRef.current = L.layerGroup().addTo(map);
      setReady((n) => n + 1);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const group = layersRef.current;
    if (!L || !map || !group) return;
    group.clearLayers();
    const bounds: import("leaflet").LatLngExpression[] = [];
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() || "#2a7a72";
    const warn = getComputedStyle(document.documentElement).getPropertyValue("--color-warn").trim() || "#8a5a1e";

    ruas.forEach((f) => {
      const active = selectedRef.current?.kind === "ruas" && selectedRef.current.id === f.properties.id;
      const layer = L.geoJSON(f as GeoJSON.Feature, {
        style: {
          color: active ? warn : accent,
          weight: active ? 5 : 3,
          opacity: 0.9,
        },
      });
      layer.on("click", (ev: { latlng: { lat: number; lng: number } }) => {
        onSelectRef.current({
          kind: "ruas",
          id: f.properties.id,
          name: f.properties.name,
          kabupaten: f.properties.kabupaten,
          lat: ev.latlng.lat,
          lng: ev.latlng.lng,
        });
      });
      layer.bindPopup(
        `<div class="simaset-popup">
          <p class="simaset-popup-title">${escapeHtml(f.properties.name)}</p>
          <p class="simaset-popup-meta">${escapeHtml(f.properties.kabupaten)} · Jalan Provinsi</p>
        </div>`,
      );
      layer.addTo(group);
      f.geometry.coordinates.forEach((line) => {
        line.forEach(([lng, lat]) => bounds.push([lat, lng]));
      });
    });

    titik.forEach((f) => {
      const [lng, lat] = f.geometry.coordinates;
      const street = googleStreetViewUrl(lat, lng);
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "simaset-pin-wrap",
          html: `<div class="${pinClass(f.properties.perlengkapan)}"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
          popupAnchor: [0, -8],
        }),
      });
      marker.bindPopup(
        `<div class="simaset-popup">
          <p class="simaset-popup-title">${escapeHtml(f.properties.perlengkapan)} · ${escapeHtml(f.properties.jenis)}</p>
          <p class="simaset-popup-meta">${escapeHtml(f.properties.ruas)} · ${escapeHtml(f.properties.kabupaten)}</p>
          <p class="simaset-popup-actions"><a href="${street}" target="_blank" rel="noreferrer">Street View</a></p>
        </div>`,
      );
      marker.on("click", () => {
        onSelectRef.current({ kind: "titik", id: f.properties.id, props: f.properties, lat, lng });
        window.open(street, "_blank", "noopener,noreferrer");
      });
      marker.addTo(group);
      bounds.push([lat, lng]);
    });

    kib.forEach((site, index) => {
      if (site.lat == null || site.lng == null) return;
      const street = locationStreetViewUrl({ lat: site.lat, lng: site.lng, name: site.name }) ?? "";
      const marker = L.marker([site.lat, site.lng], {
        icon: L.divIcon({
          className: "simaset-pin-wrap",
          html: `<div class="simaset-pin">${index + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        }),
      });
      marker.bindPopup(
        `<div class="simaset-popup">
          <p class="simaset-popup-title">${escapeHtml(site.name)}</p>
          <p class="simaset-popup-meta">${escapeHtml(site.kabupaten ?? "")} · ${formatNumber(site.assetCount)} aset</p>
          <p class="simaset-popup-actions"><a href="${street}" target="_blank" rel="noreferrer">Street View</a></p>
        </div>`,
      );
      marker.on("click", () => {
        onSelectRef.current({ kind: "kib", site });
        window.open(street, "_blank", "noopener,noreferrer");
      });
      marker.addTo(group);
      bounds.push([site.lat, site.lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds as import("leaflet").LatLngBoundsExpression, { padding: [28, 28], maxZoom: 12 });
    }
  }, [key]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;
    if (selected.kind === "ruas") map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 13), { duration: 0.4 });
    if (selected.kind === "titik") map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 15), { duration: 0.4 });
    if (selected.kind === "kib" && selected.site.lat != null && selected.site.lng != null) {
      map.flyTo([selected.site.lat, selected.site.lng], Math.max(map.getZoom(), 14), { duration: 0.4 });
    }
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className={tall ? "simaset-map h-[min(72vh,760px)] w-full" : "simaset-map h-[min(56vh,560px)] w-full"}
    />
  );
}
