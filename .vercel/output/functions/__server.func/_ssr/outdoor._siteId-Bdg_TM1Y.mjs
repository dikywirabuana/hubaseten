import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatNumber, o as siteTypeLabel } from "./format-Dl3eLtDz.mjs";
import { r as Button } from "./login-view-DjKIOS7o.mjs";
import { m as ExternalLink, s as Plus } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as listSites, n as Skeleton, t as Page, u as getSite } from "./skeleton-CtyHf9Ij.mjs";
import { t as AssetFormDialog } from "./asset-form-9UIc4V3k.mjs";
import { t as AssetTable } from "./asset-table-DClQ7IJ1.mjs";
import { r as Route$2 } from "./router-DNAZUk-m.mjs";
import { n as googleStreetViewUrl, t as OutdoorMap } from "./outdoor-map-BN-R0SqL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/outdoor._siteId-Bdg_TM1Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SitePage() {
	const { siteId } = Route$2.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: (staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteBody, {
		id: siteId,
		staff
	}) });
}
function SiteBody({ id, staff }) {
	const q = useQuery({
		queryKey: ["site", id],
		queryFn: () => getSite({ data: { id } })
	});
	const sites = useQuery({
		queryKey: ["sites"],
		queryFn: () => listSites()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96" });
	const data = q.data;
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Lokasi tidak ditemukan." });
	const { site, assets } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/outdoor",
						className: "text-xs text-muted-foreground hover:text-foreground",
						children: "← Outdoor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl font-semibold",
						children: site.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							siteTypeLabel(site.siteType),
							" · ",
							site.kabupaten,
							" · ",
							site.kmLabel,
							" · ",
							site.corridor
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: site.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm tabular-nums",
						children: [formatNumber(site.assetCount), " aset"]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [site.lat != null && site.lng != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: googleStreetViewUrl(site.lat, site.lng),
							target: "_blank",
							rel: "noreferrer",
							children: ["Street View ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
						})
					}), (staff.role === "admin" || staff.role === "operator") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Tambah"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutdoorMap, {
				sites: sites.data ?? [],
				activeId: site.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetTable, {
				assets,
				staff
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetFormDialog, {
				open,
				onOpenChange: setOpen,
				defaults: {
					topology: "outdoor",
					outdoorSiteId: site.id,
					category: "perlengkapan_jalan",
					kibGroup: "E"
				}
			})
		]
	});
}
//#endregion
export { SitePage as component };
