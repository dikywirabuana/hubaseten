import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatNumber } from "./format-Dl3eLtDz.mjs";
import { o as cn } from "./login-view-DjKIOS7o.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as listSubBidangs, f as listBidangs, m as listRooms, n as Skeleton, t as Page } from "./skeleton-CtyHf9Ij.mjs";
import { n as CardContent, t as Card } from "./card-BhpzoRDg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/indoor-IAAzLqpf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FLOORS = [
	"Lantai 2",
	"Lantai 1",
	"Halaman"
];
function IndoorPlan({ bidangs, rooms }) {
	const [floor, setFloor] = (0, import_react.useState)("Lantai 2");
	const floorRooms = rooms.filter((r) => r.floor === floor);
	const groups = bidangs.map((b) => ({
		bidang: b,
		rooms: floorRooms.filter((r) => r.bidangId === b.id)
	})).filter((g) => g.rooms.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: FLOORS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setFloor(f),
				className: cn("h-10 rounded-md px-4 text-sm font-medium", floor === f ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
				children: f
			}, f))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-xs tracking-wide text-muted-foreground uppercase",
				children: ["Kantor Dishub · KP3B Palima · ", floor]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-5",
				children: groups.map(({ bidang, rooms: list }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-accent uppercase",
					children: bidang.shortName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
					children: list.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/rooms/$roomId",
						params: { roomId: room.id },
						className: "group rounded-lg border border-border bg-paper p-3 transition-colors hover:border-accent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium group-hover:text-accent",
									children: room.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground",
									children: room.code.slice(-3)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: room.subBidangName ?? bidang.shortName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs tabular-nums",
								children: [formatNumber(room.assetCount), " barang"]
							})
						]
					}, room.id))
				})] }, bidang.id))
			})]
		})]
	});
}
function Cell({ title, name, nip, bidangId, seksi }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/indoor/$bidangId",
		params: { bidangId },
		search: { seksi },
		className: "block h-full rounded-xl bg-[#f4efe4] px-3 py-2.5 text-center text-[#17345a] shadow-sm transition hover:-translate-y-0.5 hover:bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-bold tracking-[0.06em] uppercase",
				children: title
			}),
			name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs font-semibold leading-snug",
				children: name
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs opacity-50",
				children: "—"
			}),
			nip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 font-mono text-[10px] opacity-70",
				children: ["NIP. ", nip]
			}) : null
		]
	});
}
function OrgChart({ bidangs, subs }) {
	const byId = new Map(bidangs.map((b) => [b.id, b]));
	const kadis = byId.get("pimpinan");
	const sek = byId.get("sekretariat");
	const fung = byId.get("fungsional");
	const uptd = byId.get("upt-terminal");
	const columns = [
		"prasjal",
		"lalin",
		"angkutan",
		"lautudara"
	].map((id) => byId.get(id)).filter(Boolean);
	const findSub = (id) => subs.find((s) => s.id === id);
	const umum = findSub("sub-umum");
	const perencana = findSub("sub-perencana");
	const arsip = findSub("sub-tik");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-x-auto rounded-xl bg-[#17345a] p-4 text-[#f4efe4]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-center text-xs tracking-[0.2em] uppercase opacity-80",
			children: "Struktur organisasi · klik kotak untuk membuka ruangan & aset"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-w-[880px] flex-col items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid w-full max-w-3xl grid-cols-2 gap-3",
					children: [kadis && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						title: "Plt. Kepala Dinas",
						name: kadis.headName,
						nip: kadis.headNip,
						bidangId: kadis.id
					}), sek && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
						title: "Sekretaris",
						name: sek.headName,
						nip: sek.headNip,
						bidangId: sek.id
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid w-full grid-cols-4 gap-2",
					children: [
						fung && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
							title: "Kelompok Jabatan Fungsional Ahli Utama dan Ahli Madya",
							bidangId: fung.id
						}),
						umum && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
							title: "Kepala Sub Bagian Umum dan Kepegawaian",
							name: umum.headName,
							nip: umum.headNip,
							bidangId: "sekretariat",
							seksi: umum.id
						}),
						perencana && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
							title: "Perencana Ahli Muda",
							name: perencana.headName,
							nip: perencana.headNip,
							bidangId: "sekretariat",
							seksi: perencana.id
						}),
						arsip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
							title: "Arsiparis Ahli Pertama",
							name: arsip.headName,
							nip: arsip.headNip,
							bidangId: "sekretariat",
							seksi: arsip.id
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid w-full grid-cols-4 gap-2",
					children: columns.map((b) => {
						const children = subs.filter((s) => s.bidangId === b.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								title: b.name,
								name: b.headName,
								nip: b.headNip,
								bidangId: b.id
							}), children.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
								title: s.name,
								name: s.headName,
								nip: s.headNip,
								bidangId: b.id,
								seksi: s.id
							}, s.id))]
						}, b.id);
					})
				}),
				uptd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
							title: uptd.name,
							name: uptd.headName,
							nip: uptd.headNip,
							bidangId: uptd.id
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: subs.filter((s) => s.bidangId === uptd.id).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
							title: s.name,
							name: s.headName,
							nip: s.headNip,
							bidangId: uptd.id,
							seksi: s.id
						}, s.id))
					})]
				})
			]
		})]
	});
}
function IndoorPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndoorBody, {}) });
}
function IndoorBody() {
	const bidangs = useQuery({
		queryKey: ["bidangs"],
		queryFn: () => listBidangs()
	});
	const rooms = useQuery({
		queryKey: ["rooms"],
		queryFn: () => listRooms()
	});
	const subs = useQuery({
		queryKey: ["sub-bidangs"],
		queryFn: () => listSubBidangs()
	});
	if (bidangs.isPending || rooms.isPending || subs.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96" });
	const b = bidangs.data ?? [];
	const r = rooms.data ?? [];
	const visible = b.filter((x) => x.kind !== "fungsional");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
					children: "Topologi indoor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-1 text-3xl font-semibold",
					children: "Kantor per bidang"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted-foreground",
					children: "Struktur organisasi terbaru. Klik kotak pejabat untuk membuka ruangan dan aset bidang atau seksinya."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgChart, {
				bidangs: b,
				subs: subs.data ?? []
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: visible.map((bid) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/indoor/$bidangId",
					params: { bidangId: bid.id },
					search: { seksi: void 0 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "h-full hover:border-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: bid.floor
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-medium",
									children: bid.shortName
								}),
								bid.headName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: bid.headName
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 line-clamp-2 text-xs text-muted-foreground",
									children: bid.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-xs tabular-nums text-muted-foreground",
									children: [
										bid.roomCount,
										" ruang · ",
										formatNumber(bid.assetCount),
										" aset"
									]
								})
							]
						})
					})
				}, bid.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndoorPlan, {
				bidangs: visible,
				rooms: r
			})
		]
	});
}
//#endregion
export { IndoorPage as component };
