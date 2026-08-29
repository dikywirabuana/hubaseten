import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatNumber } from "./format-Dl3eLtDz.mjs";
import { r as Button } from "./login-view-DjKIOS7o.mjs";
import { s as Plus } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as listAssets, n as Skeleton, t as Page } from "./skeleton-CtyHf9Ij.mjs";
import { t as AssetFormDialog } from "./asset-form-9UIc4V3k.mjs";
import { t as AssetTable } from "./asset-table-DClQ7IJ1.mjs";
import { n as CardContent, t as Card } from "./card-BhpzoRDg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/atk-DKvsN5nm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AtkPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: (staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtkBody, { staff }) });
}
function AtkBody({ staff }) {
	const list = useQuery({
		queryKey: ["assets", { category: "atk" }],
		queryFn: () => listAssets({ data: {
			category: "atk",
			limit: 500
		} })
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const items = list.data?.items ?? [];
	const sku = items.length;
	const qty = items.reduce((s, a) => s + a.quantity, 0);
	const baik = items.filter((a) => a.condition === "baik").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
						children: "Persediaan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-1 text-3xl font-semibold",
						children: "ATK dan rumah tangga"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted-foreground",
						children: "Stok gudang Subbag Umum: kertas, toner, map, stempel, formulir KIR, dan kelengkapan tata usaha."
					})
				] }), (staff.role === "admin" || staff.role === "operator") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Stok baru"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground uppercase",
							children: "Jenis barang"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl tabular-nums",
							children: formatNumber(sku)
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground uppercase",
							children: "Jumlah stok"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl tabular-nums",
							children: formatNumber(qty)
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground uppercase",
							children: "Kondisi baik"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl tabular-nums",
							children: formatNumber(baik)
						})]
					}) })
				]
			}),
			list.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetTable, {
				assets: items,
				staff
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetFormDialog, {
				open,
				onOpenChange: setOpen,
				defaults: {
					category: "atk",
					topology: "indoor",
					kibGroup: "P",
					kibCode: "2.1.01.01",
					roomId: "room-gudang-atk",
					bidangId: "sekretariat",
					unit: "buah"
				}
			})
		]
	});
}
//#endregion
export { AtkPage as component };
