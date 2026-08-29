import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as KIB_LABEL, n as CONDITION_LABEL, t as CATEGORY_LABEL } from "./types-K3MFItav.mjs";
import { i as formatNumber } from "./format-Dl3eLtDz.mjs";
import { r as Button } from "./login-view-DjKIOS7o.mjs";
import { s as Plus } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as listAssets, n as Skeleton, t as Page } from "./skeleton-CtyHf9Ij.mjs";
import { o as Input } from "./label-B63slmCx.mjs";
import { t as SelectField } from "./select-field-Gdhs66xH.mjs";
import { t as AssetFormDialog } from "./asset-form-9UIc4V3k.mjs";
import { t as AssetTable } from "./asset-table-DClQ7IJ1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assets-DwI8-3lz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE = 100;
function AssetsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: (staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetsBody, { staff }) });
}
function AssetsBody({ staff }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [topology, setTopology] = (0, import_react.useState)("");
	const [condition, setCondition] = (0, import_react.useState)("");
	const [kibGroup, setKibGroup] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(0);
	const [open, setOpen] = (0, import_react.useState)(false);
	const filter = (0, import_react.useMemo)(() => ({
		q: q || void 0,
		category: category || void 0,
		topology: topology || void 0,
		condition: condition || void 0,
		kibGroup: kibGroup || void 0,
		limit: PAGE,
		offset: page * PAGE
	}), [
		q,
		category,
		topology,
		condition,
		kibGroup,
		page
	]);
	const list = useQuery({
		queryKey: ["assets", filter],
		queryFn: () => listAssets({ data: filter })
	});
	const total = list.data?.total ?? 0;
	const pages = Math.max(1, Math.ceil(total / PAGE));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
						children: "Register barang"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-1 text-3xl font-semibold",
						children: "Seluruh aset"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"Data KIB B, C, dan D Dishub Banten · ",
							formatNumber(total),
							" barang"
						]
					})
				] }), (staff.role === "admin" || staff.role === "operator") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Aset baru"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Cari nama, register, merk…",
						value: q,
						onChange: (e) => {
							setQ(e.target.value);
							setPage(0);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
						value: kibGroup,
						onChange: (e) => {
							setKibGroup(e.target.value);
							setPage(0);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Semua KIB"
						}), [
							"B",
							"C",
							"D",
							"E",
							"P"
						].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: g,
							children: KIB_LABEL[g]
						}, g))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
						value: category,
						onChange: (e) => {
							setCategory(e.target.value);
							setPage(0);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Semua kategori"
						}), Object.entries(CATEGORY_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: v
						}, k))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
						value: topology,
						onChange: (e) => {
							setTopology(e.target.value);
							setPage(0);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Indoor & outdoor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "indoor",
								children: "Indoor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "outdoor",
								children: "Outdoor"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
						value: condition,
						onChange: (e) => {
							setCondition(e.target.value);
							setPage(0);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Semua kondisi"
						}), Object.entries(CONDITION_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: v
						}, k))]
					})
				]
			}),
			list.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetTable, {
				assets: list.data?.items ?? [],
				staff
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground",
					children: [
						"Halaman ",
						page + 1,
						" dari ",
						pages
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page === 0,
						onClick: () => setPage((p) => p - 1),
						children: "Sebelumnya"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: page + 1 >= pages,
						onClick: () => setPage((p) => p + 1),
						children: "Berikutnya"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetFormDialog, {
				open,
				onOpenChange: setOpen
			})
		]
	});
}
//#endregion
export { AssetsPage as component };
