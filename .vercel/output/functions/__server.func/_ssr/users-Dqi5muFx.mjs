import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as ROLE_LABEL } from "./types-K3MFItav.mjs";
import { r as Button } from "./login-view-DjKIOS7o.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { b as verifyStaff, g as listStaff, n as Skeleton, t as Page } from "./skeleton-CtyHf9Ij.mjs";
import { t as SelectField } from "./select-field-Gdhs66xH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-CtTUsxc2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-Dqi5muFx.js
var import_jsx_runtime = require_jsx_runtime();
function UsersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: (staff) => staff.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersBody, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" }) });
}
function UsersBody() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["staff"],
		queryFn: () => listStaff()
	});
	const mut = useMutation({
		mutationFn: (data) => verifyStaff({ data }),
		onSuccess: async () => {
			toast.success("Status akun diperbarui");
			await qc.invalidateQueries({ queryKey: ["staff"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" });
	const rows = q.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
				children: "Keamanan akses"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-3xl font-semibold",
				children: "Verifikasi akun Google"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted-foreground",
				children: "Hanya akun yang disetujui admin yang dapat membuka inventaris. Pengguna pertama otomatis menjadi administrator."
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
							children: "Akun"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Peran"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2.5 font-medium",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2.5 font-medium" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffRow, {
					staff: u,
					busy: mut.isPending,
					onAction: (d) => mut.mutate(d)
				}, u.userId)) })]
			})
		})]
	});
}
function StaffRow({ staff, busy, onAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: staff.displayName ?? "Tanpa nama"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: staff.email
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
					className: "h-9 w-40",
					value: staff.role,
					disabled: busy,
					onChange: (e) => onAction({
						userId: staff.userId,
						status: staff.status,
						role: e.target.value
					}),
					children: Object.entries(ROLE_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: k,
						children: v
					}, k))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: staff.status === "approved" ? "good" : staff.status === "pending" ? "warn" : "bad",
					children: staff.status === "approved" ? "Disetujui" : staff.status === "pending" ? "Menunggu" : "Ditolak"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-3 py-3 text-right",
				children: [staff.status !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					disabled: busy,
					onClick: () => onAction({
						userId: staff.userId,
						status: "approved",
						role: staff.role
					}),
					children: "Setujui"
				}), staff.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					className: "ml-2",
					disabled: busy,
					onClick: () => onAction({
						userId: staff.userId,
						status: "rejected",
						role: staff.role
					}),
					children: "Tolak"
				})]
			})
		]
	});
}
//#endregion
export { UsersPage as component };
