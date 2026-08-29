import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatNumber } from "./format-Dl3eLtDz.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as listAssets, n as Skeleton, s as getBidang, t as Page } from "./skeleton-CtyHf9Ij.mjs";
import { t as Badge } from "./badge-CtTUsxc2.mjs";
import { t as AssetTable } from "./asset-table-DClQ7IJ1.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BhpzoRDg.mjs";
import { a as Route$4 } from "./router-DNAZUk-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/indoor._bidangId-CTakjVrL.js
var import_jsx_runtime = require_jsx_runtime();
function BidangPage() {
	const { bidangId } = Route$4.useParams();
	const { seksi } = Route$4.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: (staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BidangBody, {
		id: bidangId,
		seksi,
		staff
	}) });
}
function BidangBody({ id, seksi, staff }) {
	const q = useQuery({
		queryKey: ["bidang", id],
		queryFn: () => getBidang({ data: { id } })
	});
	const assetsQ = useQuery({
		queryKey: [
			"assets",
			"bidang",
			id
		],
		queryFn: () => listAssets({ data: {
			bidangId: id,
			topology: "indoor",
			limit: 150
		} })
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96" });
	const data = q.data;
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Unit kerja tidak ditemukan." });
	const { bidang, subs, rooms } = data;
	const activeSub = seksi ? subs.find((s) => s.id === seksi) : void 0;
	const visibleRooms = seksi ? rooms.filter((r) => r.subBidangId === seksi) : rooms;
	const roomIds = new Set(visibleRooms.map((r) => r.id));
	const assets = (assetsQ.data?.items ?? []).filter((a) => !seksi || a.roomId && roomIds.has(a.roomId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/indoor",
					className: "text-xs text-muted-foreground hover:text-foreground",
					children: "← Indoor"
				}),
				activeSub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/indoor/$bidangId",
						params: { bidangId: id },
						search: { seksi: void 0 },
						className: "text-xs text-accent hover:underline",
						children: bidang.name
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-3xl font-semibold",
					children: activeSub?.name ?? bidang.name
				}),
				activeSub?.headName ?? bidang.headName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm",
					children: [activeSub?.headName ?? bidang.headName, activeSub?.headNip ?? bidang.headNip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [" · NIP ", activeSub?.headNip ?? bidang.headNip]
					}) : null]
				}) : null,
				!activeSub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: bidang.description
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: bidang.floor }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "muted",
							children: [visibleRooms.length, " ruangan"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "accent",
							children: [formatNumber(assets.length), " aset"]
						})
					]
				})
			] }),
			!activeSub && subs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Sub bidang / seksi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Klik untuk membuka ruangan dan aset seksi tersebut."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: subs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/indoor/$bidangId",
						params: { bidangId: id },
						search: { seksi: s.id },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "h-full hover:border-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: s.name
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: s.headTitle }),
									s.headName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-medium text-foreground",
										children: s.headName
									}) : null,
									s.headNip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 font-mono",
										children: s.headNip
									}) : null
								]
							})]
						})
					}, s.id))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold",
				children: "Ruangan"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [visibleRooms.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/rooms/$roomId",
					params: { roomId: room.id },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "h-full hover:border-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: room.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-xs text-muted-foreground",
									children: room.code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [
										room.subBidangName ?? "Unit pimpinan",
										" · ",
										room.floor
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-sm tabular-nums",
									children: [formatNumber(room.assetCount), " barang"]
								})
							]
						})
					})
				}, room.id)), visibleRooms.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Belum ada ruangan pada unit ini."
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Aset terkait"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 mb-3 text-xs text-muted-foreground",
					children: [
						"Barang pada ruangan ",
						activeSub ? activeSub.name : bidang.shortName,
						"."
					]
				}),
				assetsQ.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetTable, {
					assets,
					staff
				})
			] })
		]
	});
}
//#endregion
export { BidangPage as component };
