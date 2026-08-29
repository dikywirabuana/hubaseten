import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatNumber, o as siteTypeLabel } from "./format-Dl3eLtDz.mjs";
import { o as cn, r as Button } from "./login-view-DjKIOS7o.mjs";
import { m as ExternalLink } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/outdoor-map-BN-R0SqL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function googleStreetViewUrl(lat, lng) {
	return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
}
function googleMapsEmbedUrl(lat, lng, name, opts) {
	const zoom = opts?.zoom ?? (opts?.satellite ? 16 : 14);
	const layer = opts?.satellite ? "k" : "m";
	return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng} (${name})`)}&z=${zoom}&t=${layer}&hl=id&output=embed`;
}
function googleStreetViewEmbedUrl(lat, lng) {
	return `https://maps.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=12,0,0,0,0&hl=id&output=embed`;
}
function openStreetView(lat, lng) {
	window.open(googleStreetViewUrl(lat, lng), "_blank", "noopener,noreferrer");
}
function escapeHtml(value) {
	return [...value].map((ch) => {
		if (ch === "&") return "&amp;";
		if (ch === "<") return "&lt;";
		if (ch === ">") return "&gt;";
		if (ch === "\"") return "&quot;";
		return ch;
	}).join("");
}
function pinIcon(L, index, active) {
	return L.divIcon({
		className: "simaset-pin-wrap",
		html: `<div class="simaset-pin${active ? " is-active" : ""}">${index + 1}</div>`,
		iconSize: [28, 28],
		iconAnchor: [14, 14],
		popupAnchor: [0, -14]
	});
}
function SitePinsMap({ sites, selectedId, onSelect }) {
	const containerRef = (0, import_react.useRef)(null);
	const onSelectRef = (0, import_react.useRef)(onSelect);
	onSelectRef.current = onSelect;
	const mapRef = (0, import_react.useRef)(null);
	const markersRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const leafletRef = (0, import_react.useRef)(null);
	const plottable = sites.filter((s) => s.lat != null && s.lng != null);
	const plottableRef = (0, import_react.useRef)(plottable);
	plottableRef.current = plottable;
	const key = plottable.map((s) => `${s.id}:${s.lat}:${s.lng}:${s.assetCount}`).join("|");
	(0, import_react.useEffect)(() => {
		if (!containerRef.current || plottable.length === 0) return;
		let cancelled = false;
		(async () => {
			const leafletMod = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			const L = leafletMod.default ?? leafletMod;
			leafletRef.current = L;
			if (cancelled || !containerRef.current) return;
			const map = L.map(containerRef.current, { scrollWheelZoom: false });
			mapRef.current = map;
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				maxZoom: 19,
				attribution: "&copy; OpenStreetMap"
			}).addTo(map);
			const bounds = [];
			const markers = /* @__PURE__ */ new Map();
			plottable.forEach((site, index) => {
				const lat = site.lat;
				const lng = site.lng;
				bounds.push([lat, lng]);
				const street = googleStreetViewUrl(lat, lng);
				const marker = L.marker([lat, lng], { icon: pinIcon(L, index, site.id === selectedId) }).addTo(map);
				marker.bindPopup(`<div class="simaset-popup">
            <p class="simaset-popup-title">${escapeHtml(site.name)}</p>
            <p class="simaset-popup-meta">${escapeHtml(siteTypeLabel(site.siteType))} · ${escapeHtml(site.kabupaten ?? "")} · ${formatNumber(site.assetCount)} aset</p>
            <p class="simaset-popup-meta">${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
            <p class="simaset-popup-actions">
              <a href="${street}" target="_blank" rel="noreferrer">Street View</a>
              · <a href="/outdoor/${escapeHtml(site.id)}">Detail lokasi</a>
            </p>
          </div>`);
				marker.on("click", () => onSelectRef.current?.(site.id));
				markers.set(site.id, marker);
			});
			markersRef.current = markers;
			map.fitBounds(bounds, {
				padding: [32, 32],
				maxZoom: 11
			});
			(selectedId ? markers.get(selectedId) : void 0)?.openPopup();
		})();
		return () => {
			cancelled = true;
			mapRef.current?.remove();
			mapRef.current = null;
			markersRef.current = /* @__PURE__ */ new Map();
		};
	}, [key]);
	(0, import_react.useEffect)(() => {
		const L = leafletRef.current;
		const map = mapRef.current;
		if (!L || !map) return;
		plottableRef.current.forEach((site, index) => {
			const marker = markersRef.current.get(site.id);
			if (!marker) return;
			marker.setIcon(pinIcon(L, index, site.id === selectedId));
		});
		const current = selectedId ? plottableRef.current.find((s) => s.id === selectedId) : void 0;
		if (current?.lat != null && current.lng != null) {
			map.flyTo([current.lat, current.lng], Math.max(map.getZoom(), 12), { duration: .4 });
			markersRef.current.get(current.id)?.openPopup();
		}
	}, [selectedId]);
	if (plottable.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-96 place-items-center rounded-lg bg-muted text-sm text-muted-foreground",
		children: "Koordinat lokasi belum tersedia."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "simaset-map h-96 w-full"
	});
}
function OutdoorMap({ sites, activeId }) {
	const withCoords = sites.filter((s) => s.lat != null && s.lng != null);
	const [selectedId, setSelectedId] = (0, import_react.useState)(activeId ?? withCoords[0]?.id);
	const [mode, setMode] = (0, import_react.useState)("street");
	(0, import_react.useEffect)(() => {
		if (activeId) setSelectedId(activeId);
	}, [activeId]);
	const selected = sites.find((s) => s.id === selectedId) ?? withCoords[0];
	const canEmbed = selected?.lat != null && selected.lng != null;
	const lat = selected?.lat;
	const lng = selected?.lng;
	function selectPoint(id, jump = true) {
		setSelectedId(id);
		setMode("street");
		if (!jump) return;
		const site = sites.find((s) => s.id === id);
		if (site?.lat != null && site.lng != null) openStreetView(site.lat, site.lng);
	}
	const embedSrc = mode === "street" ? googleStreetViewEmbedUrl(lat, lng) : googleMapsEmbedUrl(lat, lng, selected.name, { satellite: mode === "satellite" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: mode === "street" ? "Google Street View" : "Google Maps"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: selected?.name ?? "Provinsi Banten"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: mode === "street" ? "default" : "outline",
								onClick: () => setMode("street"),
								children: "Street View"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: mode === "map" ? "default" : "outline",
								onClick: () => setMode("map"),
								children: "Peta"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: mode === "satellite" ? "default" : "outline",
								onClick: () => setMode("satellite"),
								children: "Satelit"
							}),
							canEmbed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: googleStreetViewUrl(lat, lng),
									target: "_blank",
									rel: "noreferrer",
									children: ["Buka Street View ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
								})
							})
						]
					})]
				}), canEmbed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: `Street View ${selected.name}`,
					src: embedSrc,
					className: "h-96 w-full border-0",
					loading: "lazy",
					allow: "accelerometer; gyroscope; geolocation",
					referrerPolicy: "no-referrer-when-downgrade"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-96 place-items-center text-sm text-muted-foreground",
					children: "Pilih lokasi yang memiliki koordinat."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: "Sebaran seluruh titik"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [withCoords.length, " lokasi outdoor. Klik pin untuk membuka Google Street View di titik aset."]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SitePinsMap, {
					sites,
					selectedId: selected?.id,
					onSelect: (id) => selectPoint(id)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: sites.map((s) => {
					const n = withCoords.findIndex((x) => x.id === s.id) + 1;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => selectPoint(s.id),
						className: cn("rounded-lg border px-3 py-2 text-left text-sm transition-colors hover:border-accent", selectedId === s.id ? "border-accent bg-accent/10" : "border-border bg-card"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: s.name
								}), n > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground",
									children: n
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									siteTypeLabel(s.siteType),
									" · ",
									s.kabupaten,
									" · ",
									formatNumber(s.assetCount),
									" aset"
								]
							}),
							s.lat != null && s.lng != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-[11px] text-muted-foreground",
								children: [
									s.lat.toFixed(4),
									", ",
									s.lng.toFixed(4)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 inline-block text-xs text-accent",
								children: "Buka Street View"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/outdoor/$siteId",
								params: { siteId: s.id },
								className: "mt-2 ml-2 inline-block text-xs text-muted-foreground hover:underline",
								onClick: (e) => e.stopPropagation(),
								children: "Detail"
							})
						]
					}, s.id);
				})
			})
		]
	});
}
//#endregion
export { googleStreetViewUrl as n, OutdoorMap as t };
