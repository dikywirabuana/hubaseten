import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, n as DialogClose, o as DialogPortal, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { a as ROLE_LABEL, o as authMiddleware } from "./types-K3MFItav.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { a as LoginView, c as useCurrentUserState, n as BrandLockup, o as cn, r as Button, s as useCurrentUser } from "./login-view-DjKIOS7o.mjs";
import { a as ShieldX, b as BookOpen, d as MapPinned, h as Clock3, l as Paperclip, n as Users, o as Printer, p as LayoutDashboard, t as X, u as Menu, v as Building2, y as Boxes } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skeleton-CtyHf9Ij.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var categoryZ = _enum([
	"perlengkapan_jalan",
	"jaringan",
	"gedung",
	"kendaraan",
	"alat_kantor",
	"atk",
	"jam"
]);
var topologyZ = _enum(["indoor", "outdoor"]);
var conditionZ = _enum([
	"baik",
	"rusak_ringan",
	"rusak_berat",
	"hilang"
]);
var roleZ = _enum([
	"admin",
	"operator",
	"viewer"
]);
var statusZ = _enum([
	"pending",
	"approved",
	"rejected"
]);
var getMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	email: string().nullable(),
	displayName: string().nullable(),
	photoUrl: string().nullable()
})).handler(createSsrRpc("1abc0461f8cbb28afdd9a46681b63247380c005a234d84423fc49c4a87666d1f"));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0d0ac571d669ea3ebbc5f047e612400aa7ff83cab1d132c7f48c9d14aef4b3d5"));
var verifyStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	status: statusZ,
	role: roleZ.optional()
})).handler(createSsrRpc("4c14a2c7e3f6842fa20ca7e94aeaaf78aed9a63591bb1c7ced5b983d4fccedb7"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("61e5cdef06480bfd5aee0e6e460a943963e7533080caa90e5d17b9251ea0d366"));
var listBidangs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("26d2dda6ea60d3dbf2a17a1208deec506def0c14b924bf275424ebef1ae080d9"));
var listSubBidangs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ff32c26482d6ebbe0d6cdee95ceb7d08ad09ed2df62290b2e3b879db3e85fb8d"));
var getBidang = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("81c97e9e51d01b3aa65076214fa8b823c97ad541cfa2a58622ddf3368d869d0d"));
var listRooms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("641b1d89eca76362ac60eb181bbd3c597809005b25e6a4460c47b6340f66df05"));
var getRoom = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("948cffe178a6ffb89ca4539ca297c9740fd08cec44d6af89e073e2b21e9dc8fb"));
var listSites = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fdf8e65b9728444e2f9082680f4a188263f9e729f99f48649d98ceae4db38f55"));
var getSite = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(createSsrRpc("e99328cec062004a36304a44a61bd731a6667597e22f52b91a2ddb8c9fef3d3c"));
var assetFilterZ = object({
	q: string().optional(),
	category: categoryZ.optional(),
	topology: topologyZ.optional(),
	condition: conditionZ.optional(),
	bidangId: string().optional(),
	roomId: string().optional(),
	siteId: string().optional(),
	kibGroup: string().optional(),
	limit: number().min(1).max(500).optional(),
	offset: number().min(0).optional()
});
var listAssets = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(assetFilterZ).handler(createSsrRpc("03ad926f079d3185a7283948d0338a54aefad8a85ae3e18170c212e3e40ec2b2"));
var assetInputZ = object({
	registerNo: string().min(3),
	kibCode: string().min(1),
	kibGroup: string().min(1),
	category: categoryZ,
	topology: topologyZ,
	name: string().min(2),
	spec: string().nullable().optional(),
	brand: string().nullable().optional(),
	material: string().nullable().optional(),
	yearAcquired: number().int().min(1980).max(2100).nullable().optional(),
	quantity: number().int().min(0),
	unit: string().min(1),
	unitPrice: number().min(0).optional(),
	condition: conditionZ,
	roomId: string().nullable().optional(),
	outdoorSiteId: string().nullable().optional(),
	bidangId: string().nullable().optional(),
	sourceOfFunds: string().nullable().optional(),
	serialNo: string().nullable().optional(),
	notes: string().nullable().optional(),
	masterId: string().nullable().optional(),
	lat: number().nullable().optional(),
	lng: number().nullable().optional(),
	photo: string().nullable().optional()
});
var createAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(assetInputZ).handler(createSsrRpc("9ac86905ffe301773b43db06128f4ac8a23bb644358c7b4375ea142e6f6401fb"));
var updateAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(assetInputZ.extend({ id: string().min(1) })).handler(createSsrRpc("fb8352c623eb2ca86946f635ea120be437edf713a3d0cbbf254bcc5656773e09"));
var deleteAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(createSsrRpc("8040f9a1352f23ac0be30cead6f8709cab26ce574a3f3a9d415985744d62633c"));
var listMasters = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a5e926553cccbc1ba6a10d8bda173e6fe23cac6331fc97b78ff06b6eeddd7f83"));
var masterInputZ = object({
	code: string().min(2),
	name: string().min(2),
	brand: string().nullable().optional(),
	spec: string().nullable().optional(),
	category: categoryZ,
	kibGroup: string().min(1),
	kibCode: string().min(1),
	unit: string().min(1),
	material: string().nullable().optional(),
	topology: topologyZ,
	active: boolean().optional()
});
var createMaster = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(masterInputZ).handler(createSsrRpc("734700e4c312e93abdf52bd925da0ad1d4fd49f1f6469344ed1e5f560ae2b3d5"));
var updateMaster = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(masterInputZ.extend({ id: string().min(1) })).handler(createSsrRpc("5cddd8ec1c3f6b4a97b3d79dc28fad89bc5485c121e35a2053aa3208618bc3af"));
var deleteMaster = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(createSsrRpc("74cb8185340db341820b2237039b83bdee4aa8c72dbdb36de36f86dd3315196f"));
var Sheet = Dialog;
function SheetContent({ className, children, side = "left", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full w-[min(100%,20rem)] flex-col bg-sidebar text-sidebar-foreground", side === "left" ? "top-0 left-0" : "top-0 right-0", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-md p-1 text-sidebar-muted hover:bg-sidebar-accent",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Tutup"
			})]
		})]
	})] });
}
var NAV = [
	{
		to: "/",
		label: "Dasbor",
		icon: LayoutDashboard
	},
	{
		to: "/indoor",
		label: "Indoor · Kantor",
		icon: Building2
	},
	{
		to: "/outdoor",
		label: "Outdoor · Jalan",
		icon: MapPinned
	},
	{
		to: "/assets",
		label: "Seluruh Aset",
		icon: Boxes
	},
	{
		to: "/master",
		label: "Master Data",
		icon: BookOpen
	},
	{
		to: "/atk",
		label: "ATK & Persediaan",
		icon: Paperclip
	},
	{
		to: "/kir",
		label: "Cetak KIR",
		icon: Printer
	}
];
function AppShell({ staff, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-sidebar-foreground md:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBody, { staff })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "md:hidden",
							onClick: () => setOpen(true),
							"aria-label": "Menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: "Sistem Informasi Manajemen Aset"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: "Dinas Perhubungan Provinsi Banten"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserChip, { staff })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-6 sm:px-6 lg:px-8",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBody, {
					staff,
					onNavigate: () => setOpen(false)
				}) })
			})
		]
	});
}
function NavBody({ staff, onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-1 flex-col gap-0.5 px-3",
				children: [NAV.map((item) => {
					const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: onNavigate,
						className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", active ? "bg-sidebar-foreground/12 text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), item.label]
					}, item.to);
				}), staff.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/users",
					onClick: onNavigate,
					className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors", pathname.startsWith("/users") ? "bg-sidebar-foreground/12 text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 shrink-0" }), "Verifikasi Akun"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-5 py-4 text-[11px] leading-relaxed text-sidebar-muted",
				children: "Kantor KP3B Palima, Serang · Struktur organisasi 2025"
			})
		]
	});
}
function UserChip({ staff }) {
	const user = useCurrentUser();
	const label = staff.displayName ?? user?.displayName ?? staff.email;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			staff.photoUrl || user?.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: staff.photoUrl ?? user?.profileImageUrl ?? "",
				alt: "",
				className: "size-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-8 place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden min-w-0 sm:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-36 truncate text-sm font-medium",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground",
					children: ROLE_LABEL[staff.role]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => void signOut(),
				children: "Keluar"
			})
		]
	});
}
function Emblem({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 48",
		className,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "48",
				height: "48",
				rx: "12",
				fill: "currentColor",
				opacity: "0.12"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M10 34h28M13 34l6-14h10l6 14",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.2",
				strokeLinejoin: "round",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "24",
				cy: "16",
				r: "3.2",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M17 34v5M31 34v5",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round"
			})
		]
	});
}
function StaffGate({ children }) {
	const { user } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["staff-me", user?.id],
		enabled: Boolean(user),
		queryFn: () => getMyProfile({ data: {
			email: user?.primaryEmail ?? null,
			displayName: user?.displayName ?? null,
			photoUrl: user?.profileImageUrl ?? null
		} })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginView, {});
	if (profile.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "SIMASET"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Memeriksa verifikasi akun Google…"
			})]
		})
	});
	if (profile.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldScreen, {
		title: "Tidak dapat memuat profil",
		body: "Sesi mungkin kedaluwarsa. Masuk ulang dengan akun Google dinas."
	});
	const staff = profile.data;
	if (!staff) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginView, {});
	if (staff.status === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldScreen, {
		title: "Menunggu verifikasi admin",
		body: `${staff.displayName ?? staff.email} sudah masuk. Admin SIMASET akan meninjau akun Google terdaftar sebelum akses inventaris dibuka.`,
		icon: "wait"
	});
	if (staff.status === "rejected") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldScreen, {
		title: "Akses belum disetujui",
		body: "Akun Google ini ditolak oleh administrator. Hubungi pengurus barang atau Kasubbag Umum Dishub Provinsi Banten.",
		icon: "deny"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: children(staff) });
}
function HoldScreen({ title, body, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-background px-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl border border-border bg-card p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground",
					children: icon === "deny" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldX, { className: "size-7" }) : icon === "wait" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-7" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Emblem, { className: "size-10 text-primary-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase",
					children: "SIMASET · Dishub Banten"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-2xl font-semibold",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "mt-6",
					onClick: () => void signOut(),
					children: "Keluar"
				})
			]
		})
	});
}
function Page({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffGate, { children: (staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		staff,
		children: children(staff)
	}) });
}
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("animate-pulse rounded-md bg-muted", className) });
}
//#endregion
export { listSubBidangs as _, deleteAsset as a, verifyStaff as b, getDashboard as c, listAssets as d, listBidangs as f, listStaff as g, listSites as h, createMaster as i, getRoom as l, listRooms as m, Skeleton as n, deleteMaster as o, listMasters as p, createAsset as r, getBidang as s, Page as t, getSite as u, updateAsset as v, updateMaster as y };
