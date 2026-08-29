import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatNumber } from "./format-Dl3eLtDz.mjs";
import { r as Button } from "./login-view-DjKIOS7o.mjs";
import { o as Printer, s as Plus } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as getRoom, n as Skeleton, t as Page } from "./skeleton-CtyHf9Ij.mjs";
import { t as AssetFormDialog } from "./asset-form-9UIc4V3k.mjs";
import { t as AssetTable } from "./asset-table-DClQ7IJ1.mjs";
import { n as Route$1 } from "./router-DNAZUk-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms._roomId-Bhjab-rl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoomPage() {
	const { roomId } = Route$1.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: (staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomBody, {
		id: roomId,
		staff
	}) });
}
function RoomBody({ id, staff }) {
	const q = useQuery({
		queryKey: ["room", id],
		queryFn: () => getRoom({ data: { id } })
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96" });
	const data = q.data;
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ruangan tidak ditemukan." });
	const { room, assets } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/indoor/$bidangId",
						params: { bidangId: room.bidangId },
						search: { seksi: room.subBidangId ?? void 0 },
						className: "text-xs text-muted-foreground hover:text-foreground",
						children: ["← ", room.bidangName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl font-semibold",
						children: room.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							room.building,
							" · ",
							room.floor,
							" · kode ",
							room.code
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"PJ: ",
							room.picName ?? "—",
							room.picNip ? ` · ${room.picNip}` : "",
							" · ",
							formatNumber(room.assetCount),
							" barang"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/kir/$roomId",
							params: { roomId: room.id },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " Cetak KIR"]
						})
					}), (staff.role === "admin" || staff.role === "operator") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Tambah"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetTable, {
				assets,
				staff
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetFormDialog, {
				open,
				onOpenChange: setOpen,
				defaults: {
					topology: "indoor",
					roomId: room.id,
					bidangId: room.bidangId,
					category: "alat_kantor"
				}
			})
		]
	});
}
//#endregion
export { RoomPage as component };
