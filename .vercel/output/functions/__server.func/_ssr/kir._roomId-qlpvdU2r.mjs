import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as formatNumber, n as conditionLabel, r as displayAssetName } from "./format-Dl3eLtDz.mjs";
import { i as DishubSeal, r as Button, t as BantenSeal } from "./login-view-DjKIOS7o.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as getRoom, n as Skeleton, t as Page } from "./skeleton-CtyHf9Ij.mjs";
import { i as Route$3 } from "./router-DNAZUk-m.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kir._roomId-qlpvdU2r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function roomHeadline(room) {
	return `RUANGAN ${room.name.replace(/^ruang(an)?\s+/i, "").trim().toUpperCase()}`;
}
function KirPlaque({ room }) {
	const [qr, setQr] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const url = `${window.location.origin}/kir/${room.id}`;
		import_lib.toDataURL(url, {
			width: 360,
			margin: 1,
			errorCorrectionLevel: "M",
			color: {
				dark: "#111111",
				light: "#ffffff"
			}
		}).then(setQr);
	}, [room.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "kir-plaque relative overflow-hidden bg-[#f3f5f7] text-[#1a1a1a]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "pointer-events-none absolute inset-0 h-full w-full",
			viewBox: "0 0 1000 640",
			preserveAspectRatio: "none",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 0 H220 L150 90 H0 Z",
					fill: "#1e4d86",
					opacity: "0.12"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M1000 0 L1000 210 L780 0 Z",
					fill: "#163a6a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M1000 0 L1000 150 L840 0 Z",
					fill: "#2a5f9a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M1000 40 L1000 250 L720 40 Z",
					fill: "#1e4d86",
					opacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 640 L280 640 L0 430 Z",
					fill: "#163a6a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 640 L190 640 L0 500 Z",
					fill: "#2a5f9a"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M40 640 L320 640 L40 470 Z",
					fill: "#1e4d86",
					opacity: "0.28"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M18 18 H210",
					stroke: "#1e4d86",
					strokeWidth: "2.2",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M18 18 V150",
					stroke: "#1e4d86",
					strokeWidth: "2.2",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M982 622 H790",
					stroke: "#1e4d86",
					strokeWidth: "2.2",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M982 622 V490",
					stroke: "#1e4d86",
					strokeWidth: "2.2",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M70 18 L210 18 L160 70",
					stroke: "#7ea3d4",
					strokeWidth: "1.2",
					fill: "none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M930 80 L1000 20",
					stroke: "white",
					strokeWidth: "6",
					opacity: "0.35"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M860 40 L1000 90",
					stroke: "white",
					strokeWidth: "3",
					opacity: "0.25"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 flex h-full flex-col px-8 py-6 sm:px-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BantenSeal, { className: "size-20 shrink-0 object-contain sm:size-24" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 pt-2 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-semibold tracking-[0.12em] text-[#8a7344] uppercase sm:text-4xl",
								children: "Barang milik daerah"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display mt-1 text-xl font-semibold tracking-[0.14em] text-[#8a7344] uppercase sm:text-3xl",
								children: "Dinas Perhubungan"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishubSeal, { className: "size-20 shrink-0 object-contain sm:size-24" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.28em] text-[#b42318] uppercase",
						children: "Kartu inventaris ruangan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm font-semibold tracking-[0.12em] uppercase sm:text-base",
						children: roomHeadline(room)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-1 items-center justify-center py-4",
					children: qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: qr,
						alt: `QR inventaris ${room.name}`,
						className: "size-44 bg-white p-2 sm:size-52"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-44 bg-white sm:size-52" })
				})
			]
		})]
	});
}
function KirDocument({ room, assets }) {
	const totalQty = assets.reduce((s, a) => s + a.quantity, 0);
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 print:space-y-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KirPlaque, { room }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "print-sheet kir-lampiran mx-auto max-w-5xl bg-white text-black",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-start gap-4 border-b-2 border-black pb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BantenSeal, { className: "size-16 shrink-0 object-contain" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-[0.18em] uppercase",
									children: "Pemerintah Provinsi Banten"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-2xl font-semibold",
									children: "Dinas Perhubungan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs",
									children: ["Lampiran Kartu Inventaris Ruangan · ", year]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-xl font-semibold tracking-wide",
									children: room.name
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishubSeal, { className: "size-16 shrink-0 object-contain" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "SKPD",
							v: "Dinas Perhubungan Provinsi Banten"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Nama ruangan",
							v: room.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Kode lokasi",
							v: room.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Bidang / unit",
							v: room.bidangName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Sub bidang",
							v: room.subBidangName ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Lantai / gedung",
							v: `${room.floor} · ${room.building}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Penanggung jawab",
							v: room.picName ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "NIP",
							v: room.picNip ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Jumlah barang",
							v: `${formatNumber(assets.length)} jenis`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full border-collapse text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"No",
							"Kode barang",
							"Nama barang",
							"Merk / type",
							"No. register",
							"Bahan",
							"Thn",
							"Jml",
							"Sat",
							"Ket / kondisi"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "border border-black px-1.5 py-1 text-left font-semibold",
							children: h
						}, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
							assets.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1",
									children: i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1 font-mono",
									children: a.kibCode
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1",
									children: displayAssetName(a)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1",
									children: [a.brand, a.spec].filter(Boolean).join(" · ") || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1 font-mono",
									children: a.registerNo
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1",
									children: a.material ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1",
									children: a.yearAcquired ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1 tabular-nums",
									children: formatNumber(a.quantity)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1",
									children: a.unit
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "border border-black px-1.5 py-1",
									children: [conditionLabel(a.condition), a.notes ? ` · ${a.notes}` : ""]
								})
							] }, a.id)),
							assets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 10,
								className: "border border-black px-2 py-6 text-center",
								children: "Tidak ada barang pada ruangan ini."
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "border border-black px-1.5 py-1 text-right font-semibold",
									children: "Jumlah"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "border border-black px-1.5 py-1 font-semibold tabular-nums",
									children: formatNumber(totalQty)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black px-1.5 py-1" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black px-1.5 py-1" })
							] })
						] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid grid-cols-3 gap-4 text-center text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignBlock, {
							title: "Pengurus Barang",
							name: "________________",
							nip: "NIP. "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignBlock, {
							title: "Penanggung Jawab Ruangan",
							name: room.picName ?? "________________",
							nip: room.picNip ? `NIP. ${room.picNip}` : "NIP. "
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignBlock, {
							title: "Pengguna Barang",
							name: "Endad Haryanto, SE, M.Si",
							nip: "NIP. 19730403 200112 1 003"
						})
					]
				})
			]
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "w-36 shrink-0 text-neutral-600",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "font-medium",
			children: v
		})]
	});
}
function SignBlock({ title, name, nip }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Serang, ………………" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-semibold underline decoration-dotted",
			children: name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs",
			children: nip
		})
	] });
}
function KirPrint() {
	const { roomId } = Route$3.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KirBody, { id: roomId }) });
}
function KirBody({ id }) {
	const q = useQuery({
		queryKey: ["room", id],
		queryFn: () => getRoom({ data: { id } })
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96" });
	const data = q.data;
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ruangan tidak ditemukan." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/rooms/$roomId",
				params: { roomId: id },
				className: "text-sm text-muted-foreground",
				children: "← Kembali ke ruangan"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => window.print(),
				children: "Cetak plakat & daftar"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border bg-white p-6 print:border-0 print:p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KirDocument, {
				room: data.room,
				assets: data.assets
			})
		})]
	});
}
//#endregion
export { KirPrint as component };
