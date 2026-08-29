import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as CATEGORY_LABEL } from "./types-K3MFItav.mjs";
import { i as formatNumber, n as conditionLabel, t as categoryLabel } from "./format-Dl3eLtDz.mjs";
import { r as Button } from "./login-view-DjKIOS7o.mjs";
import { d as MapPinned, g as ClipboardList, s as Plus, v as Building2 } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as getDashboard, n as Skeleton, t as Page } from "./skeleton-CtyHf9Ij.mjs";
import { t as AssetFormDialog } from "./asset-form-9UIc4V3k.mjs";
import { t as Badge } from "./badge-CtTUsxc2.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-BhpzoRDg.mjs";
import { a as Bar, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as Pie, r as YAxis, s as Cell, t as PieChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CNP3d1A6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PIE_COLORS = [
	"var(--color-primary)",
	"var(--color-accent)",
	"var(--color-warn)",
	"#0f766e",
	"#1d4ed8",
	"var(--color-muted-foreground)",
	"#9a3412"
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: (staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, { staff }) });
}
function Dashboard({ staff }) {
	const dash = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	if (dash.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" })
		]
	});
	const d = dash.data;
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Gagal memuat dasbor."
	});
	const catData = d.byCategory.map((c) => ({
		name: categoryLabel(c.category),
		value: c.count
	}));
	const condData = d.byCondition.map((c) => ({
		name: conditionLabel(c.condition),
		value: c.count
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
						children: "Dasbor inventaris"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-1 text-3xl font-semibold",
						children: "Aset Dishub Banten"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted-foreground",
						children: "Ringkasan barang milik daerah: perlengkapan jalan, alat kantor, ATK, dan jam pada topologi indoor kantor serta outdoor ruas jalan provinsi."
					})
				] }), (staff.role === "admin" || staff.role === "operator") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Aset baru"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Total aset",
						value: formatNumber(d.totalAssets),
						hint: "seluruh kategori"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Ruangan",
						value: formatNumber(d.roomCount),
						hint: "kantor indoor",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Indoor",
						value: formatNumber(d.indoorCount),
						hint: `${d.roomCount} ruangan`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Outdoor",
						value: formatNumber(d.outdoorCount),
						hint: `${d.siteCount} lokasi jalan`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Jumlah aset per unit kerja" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: d.byBidang,
								margin: {
									top: 8,
									right: 8,
									left: 0,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "shortName",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: { fontSize: 11 },
										allowDecimals: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (v) => formatNumber(Number(v ?? 0)),
										contentStyle: {
											background: "var(--color-card)",
											border: "1px solid var(--color-border)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										fill: "var(--color-primary)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Komposisi kategori" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "h-72",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: catData,
								dataKey: "value",
								nameKey: "name",
								innerRadius: 52,
								outerRadius: 80,
								children: catData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-card)",
								border: "1px solid var(--color-border)"
							} })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: d.byCategory.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "muted",
								children: [
									CATEGORY_LABEL[c.category],
									" · ",
									c.count
								]
							}, c.category))
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Kondisi barang" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3",
					children: condData.map((c) => {
						const pct = d.totalAssets ? Math.round(c.value / d.totalAssets * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-muted-foreground",
								children: [
									c.value,
									" · ",
									pct,
									"%"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary",
								style: { width: `${pct}%` }
							})
						})] }, c.name);
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Lokasi outdoor terpadat" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-2",
					children: d.bySite.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/outdoor/$siteId",
						params: { siteId: s.id },
						className: "flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: s.kabupaten
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm tabular-nums",
							children: s.count
						})]
					}, s.id))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/indoor",
					className: "rounded-xl border border-border bg-card p-5 hover:border-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Topologi indoor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-1 text-2xl",
							children: "Kantor per bidang"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Ruang Kadis hingga UPT, lengkap dengan KIR per ruangan."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/outdoor",
					className: "rounded-xl border border-border bg-card p-5 hover:border-accent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Topologi outdoor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display mt-1 text-2xl",
							children: "Perlengkapan jalan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "APILL, PJU, rambu, guardrail, dan VMS di ruas provinsi."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetFormDialog, {
				open,
				onOpenChange: setOpen
			})
		]
	});
}
function Stat({ label, value, hint, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide uppercase",
					children: label
				}), icon]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl font-semibold tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	}) });
}
//#endregion
export { Home as component };
