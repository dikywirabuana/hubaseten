import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as KIB_LABEL, r as KIB_GROUPS, t as CATEGORY_LABEL } from "./types-K3MFItav.mjs";
import { r as Button } from "./login-view-DjKIOS7o.mjs";
import { i as Trash2, s as Plus } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { i as createMaster, n as Skeleton, o as deleteMaster, p as listMasters, t as Page, y as updateMaster } from "./skeleton-CtyHf9Ij.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as Input, s as Label, t as Dialog } from "./label-B63slmCx.mjs";
import { t as SelectField } from "./select-field-Gdhs66xH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/master-DJp8jVt5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MasterPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: (staff) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasterBody, { staff }) });
}
function MasterBody({ staff }) {
	const q = useQuery({
		queryKey: ["masters"],
		queryFn: () => listMasters()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const canEdit = staff.role === "admin" || staff.role === "operator";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
						children: "Referensi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-1 text-3xl font-semibold",
						children: "Master data aset"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted-foreground",
						children: "Katalog barang: kode, merk/tipe, KIB, satuan. Input aset memilih dari daftar ini."
					})
				] }), canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						setEdit(null);
						setOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Item baru"]
				})]
			}),
			q.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2.5 font-medium",
								children: "Nama"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2.5 font-medium",
								children: "Kode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2.5 font-medium",
								children: "Kategori"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2.5 font-medium",
								children: "Satuan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2.5 font-medium",
								children: "Topologi"
							}),
							canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2.5 font-medium" })
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (q.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: m.brand ? `${m.brand} ${m.name}` : m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: m.spec ?? "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 font-mono text-xs",
								children: m.kibCode
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 text-xs",
								children: CATEGORY_LABEL[m.category]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5",
								children: m.unit
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 text-xs",
								children: m.topology
							}),
							canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2.5 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => {
										setEdit(m);
										setOpen(true);
									},
									children: "Ubah"
								})
							})
						]
					}, m.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasterDialog, {
				open,
				onOpenChange: setOpen,
				item: edit,
				staff
			})
		]
	});
}
function MasterDialog({ open, onOpenChange, item, staff }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		code: "",
		kibCode: "",
		kibGroup: "B",
		brand: "",
		spec: "",
		category: "alat_kantor",
		unit: "unit",
		material: "",
		topology: "indoor"
	});
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				name: form.name,
				code: form.code || form.kibCode,
				kibCode: form.kibCode,
				kibGroup: form.kibGroup,
				brand: form.brand || null,
				spec: form.spec || null,
				category: form.category,
				unit: form.unit,
				material: form.material || null,
				topology: form.topology,
				active: true
			};
			if (item) return updateMaster({ data: {
				...payload,
				id: item.id
			} });
			return createMaster({ data: payload });
		},
		onSuccess: async () => {
			toast.success("Master data disimpan");
			await qc.invalidateQueries({ queryKey: ["masters"] });
			onOpenChange(false);
		},
		onError: (e) => toast.error(e.message)
	});
	const del = useMutation({
		mutationFn: () => deleteMaster({ data: { id: item.id } }),
		onSuccess: async () => {
			toast.success("Master data dihapus");
			await qc.invalidateQueries({ queryKey: ["masters"] });
			onOpenChange(false);
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (v) setForm({
				name: item?.name ?? "",
				code: item?.code ?? "",
				kibCode: item?.kibCode ?? "",
				kibGroup: item?.kibGroup ?? "B",
				brand: item?.brand ?? "",
				spec: item?.spec ?? "",
				category: item?.category ?? "alat_kantor",
				unit: item?.unit ?? "unit",
				material: item?.material ?? "",
				topology: item?.topology ?? "indoor"
			});
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: item ? "Ubah master data" : "Master data baru" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3 sm:grid-cols-2",
			onSubmit: (e) => {
				e.preventDefault();
				save.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1.5 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama barang" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: form.name,
						onChange: (e) => setForm({
							...form,
							name: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kode barang" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: form.kibCode,
						onChange: (e) => setForm({
							...form,
							kibCode: e.target.value,
							code: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "KIB" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
						value: form.kibGroup,
						onChange: (e) => setForm({
							...form,
							kibGroup: e.target.value
						}),
						children: KIB_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: g,
							children: KIB_LABEL[g]
						}, g))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kategori" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
						value: form.category,
						onChange: (e) => setForm({
							...form,
							category: e.target.value
						}),
						children: Object.entries(CATEGORY_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: v
						}, k))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Topologi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
						value: form.topology,
						onChange: (e) => setForm({
							...form,
							topology: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "indoor",
							children: "Indoor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "outdoor",
							children: "Outdoor"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Merk / tipe" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.brand,
						onChange: (e) => setForm({
							...form,
							brand: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Satuan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						required: true,
						value: form.unit,
						onChange: (e) => setForm({
							...form,
							unit: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1.5 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Spesifikasi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: form.spec,
						onChange: (e) => setForm({
							...form,
							spec: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-2 sm:col-span-2",
					children: [item && staff.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => {
							if (confirm("Hapus item master?")) del.mutate();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Hapus"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: save.isPending,
						children: save.isPending ? "Menyimpan…" : "Simpan"
					})]
				})
			]
		})] })
	});
}
//#endregion
export { MasterPage as component };
