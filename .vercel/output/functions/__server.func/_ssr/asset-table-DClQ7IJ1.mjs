import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatNumber, n as conditionLabel, r as displayAssetName, t as categoryLabel } from "./format-Dl3eLtDz.mjs";
import { r as Button } from "./login-view-DjKIOS7o.mjs";
import { c as Pencil, i as Trash2 } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as deleteAsset } from "./skeleton-CtyHf9Ij.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AssetFormDialog } from "./asset-form-9UIc4V3k.mjs";
import { t as Badge } from "./badge-CtTUsxc2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset-table-DClQ7IJ1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function conditionVariant(c) {
	if (c === "baik") return "good";
	if (c === "rusak_ringan") return "warn";
	if (c === "rusak_berat" || c === "hilang") return "bad";
	return "muted";
}
function AssetTable({ assets, staff }) {
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const qc = useQueryClient();
	const canEdit = staff.role === "admin" || staff.role === "operator";
	const del = useMutation({
		mutationFn: (id) => deleteAsset({ data: { id } }),
		onSuccess: async () => {
			toast.success("Aset dihapus");
			await qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	if (assets.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground",
		children: "Belum ada aset pada saringan ini."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Barang"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Register"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Lokasi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Jml"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Geotag"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Kondisi"
						}),
						canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2.5 font-medium" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [a.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPreview(a.photo),
									className: "shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: a.photo,
										alt: "",
										className: "size-10 rounded object-cover"
									})
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: displayAssetName(a)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: a.spec ? a.spec : categoryLabel(a.category)
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 font-mono text-xs",
							children: a.registerNo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 text-xs",
							children: a.topology === "indoor" ? a.roomName : a.outdoorSiteName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2.5 tabular-nums",
							children: [
								formatNumber(a.quantity),
								" ",
								a.unit
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 font-mono text-[11px] text-muted-foreground",
							children: a.lat != null && a.lng != null ? `${a.lat.toFixed(5)}, ${a.lng.toFixed(5)}` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: conditionVariant(a.condition),
								children: conditionLabel(a.condition)
							})
						}),
						canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-3 py-2.5 text-right whitespace-nowrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Ubah",
								onClick: () => setEdit(a),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
							}), staff.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Hapus",
								onClick: () => {
									if (confirm(`Hapus ${a.name}?`)) del.mutate(a.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						})
					]
				}, a.id)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetFormDialog, {
			open: Boolean(edit),
			onOpenChange: (v) => !v && setEdit(null),
			asset: edit
		}),
		preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "fixed inset-0 z-50 grid place-items-center bg-ink/70 p-6",
			onClick: () => setPreview(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: preview,
				alt: "Foto aset",
				className: "max-h-[80vh] max-w-full rounded-lg"
			})
		}) : null
	] });
}
//#endregion
export { AssetTable as t };
