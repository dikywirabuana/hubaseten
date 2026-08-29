import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatNumber } from "./format-Dl3eLtDz.mjs";
import { r as Button } from "./login-view-DjKIOS7o.mjs";
import { o as Printer } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { m as listRooms, n as Skeleton, t as Page } from "./skeleton-CtyHf9Ij.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kir-DNULMBiT.js
var import_jsx_runtime = require_jsx_runtime();
function KirIndex() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KirList, {}) });
}
function KirList() {
	const q = useQuery({
		queryKey: ["rooms"],
		queryFn: () => listRooms()
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" });
	const rooms = q.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
				children: "Dokumen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-3xl font-semibold",
				children: "Kartu Inventaris Ruangan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted-foreground",
				children: "Pilih ruangan untuk mencetak plakat KIR (logo, judul, dan QR) plus lampiran daftar barang."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Ruangan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Bidang"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Kode"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Barang"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2.5 font-medium" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rooms.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 font-medium",
							children: r.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 text-muted-foreground",
							children: r.bidangName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 font-mono text-xs",
							children: r.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 tabular-nums",
							children: formatNumber(r.assetCount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2.5 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/kir/$roomId",
									params: { roomId: r.id },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), " Cetak"]
								})
							})
						})
					]
				}, r.id)) })]
			})
		})]
	});
}
//#endregion
export { KirIndex as component };
