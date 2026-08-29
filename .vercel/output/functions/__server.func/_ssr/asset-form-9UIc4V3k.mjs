import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as KIB_LABEL, n as CONDITION_LABEL, r as KIB_GROUPS, t as CATEGORY_LABEL } from "./types-K3MFItav.mjs";
import { o as cn, r as Button } from "./login-view-DjKIOS7o.mjs";
import { _ as Camera, f as MapPin, i as Trash2 } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { f as listBidangs, h as listSites, m as listRooms, p as listMasters, r as createAsset, v as updateAsset } from "./skeleton-CtyHf9Ij.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as Input, r as DialogDescription, s as Label, t as Dialog } from "./label-B63slmCx.mjs";
import { t as SelectField } from "./select-field-Gdhs66xH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset-form-9UIc4V3k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props
	});
}
function compressImage(file, max = 960, quality = .72) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, max / Math.max(img.width, img.height));
			const canvas = document.createElement("canvas");
			canvas.width = Math.max(1, Math.round(img.width * scale));
			canvas.height = Math.max(1, Math.round(img.height * scale));
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("Canvas tidak tersedia"));
				return;
			}
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", quality));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Gagal membaca foto"));
		};
		img.src = url;
	});
}
function readDeviceGeo() {
	if (!navigator.geolocation) return Promise.resolve(null);
	return new Promise((resolve) => {
		navigator.geolocation.getCurrentPosition((pos) => resolve({
			lat: pos.coords.latitude,
			lng: pos.coords.longitude
		}), () => resolve(null), {
			enableHighAccuracy: true,
			timeout: 12e3,
			maximumAge: 15e3
		});
	});
}
function gpsToDecimal(values, refs) {
	const d = values[0] ?? 0;
	const m = values[1] ?? 0;
	const s = values[2] ?? 0;
	let dec = d + m / 60 + s / 3600;
	if (refs === "S" || refs === "W") dec = -dec;
	return dec;
}
async function readJpegGps(file) {
	const buf = await file.arrayBuffer();
	const view = new DataView(buf);
	if (view.byteLength < 12 || view.getUint16(0) !== 65496) return null;
	let offset = 2;
	while (offset + 4 < view.byteLength) {
		if (view.getUint8(offset) !== 255) break;
		const marker = view.getUint8(offset + 1);
		const size = view.getUint16(offset + 2);
		if (marker === 225) {
			const start = offset + 4;
			if (ascii(view, start, 4) === "Exif") return parseExifGps(view, start + 6);
		}
		if (marker === 218) break;
		offset += 2 + size;
	}
	return null;
}
function ascii(view, start, len) {
	let s = "";
	for (let i = 0; i < len; i += 1) s += String.fromCharCode(view.getUint8(start + i));
	return s;
}
function parseExifGps(view, tiff) {
	const le = view.getUint16(tiff) === 18761;
	const u16 = (p) => le ? view.getUint16(p, true) : view.getUint16(p, false);
	const u32 = (p) => le ? view.getUint32(p, true) : view.getUint32(p, false);
	const gpsOffset = findTagOffset(view, tiff + u32(tiff + 4), tiff, 34853, le, u16, u32);
	if (gpsOffset == null) return null;
	const gpsIfd = tiff + gpsOffset;
	const lat = readGpsRational(view, gpsIfd, tiff, 2, le, u16, u32);
	const latRef = readGpsAscii(view, gpsIfd, tiff, 1, le, u16, u32);
	const lng = readGpsRational(view, gpsIfd, tiff, 4, le, u16, u32);
	const lngRef = readGpsAscii(view, gpsIfd, tiff, 3, le, u16, u32);
	if (!lat || !lng || !latRef || !lngRef) return null;
	return {
		lat: gpsToDecimal(lat, latRef),
		lng: gpsToDecimal(lng, lngRef)
	};
}
function findTagOffset(view, ifd, tiff, tag, le, u16, u32) {
	if (ifd + 2 > view.byteLength) return null;
	const n = u16(ifd);
	for (let i = 0; i < n; i += 1) {
		const p = ifd + 2 + i * 12;
		if (u16(p) === tag) {
			u16(p + 2);
			return u32(p + 8);
		}
	}
	return null;
}
function readGpsAscii(view, ifd, tiff, tag, le, u16, u32) {
	const n = u16(ifd);
	for (let i = 0; i < n; i += 1) {
		const p = ifd + 2 + i * 12;
		if (u16(p) !== tag) continue;
		if (u32(p + 4) <= 4) return ascii(view, p + 8, 1);
		return ascii(view, tiff + u32(p + 8), 1);
	}
	return null;
}
function readGpsRational(view, ifd, tiff, tag, le, u16, u32) {
	const n = u16(ifd);
	for (let i = 0; i < n; i += 1) {
		const p = ifd + 2 + i * 12;
		if (u16(p) !== tag) continue;
		const count = u32(p + 4);
		const off = tiff + u32(p + 8);
		const out = [];
		for (let k = 0; k < Math.min(count, 3); k += 1) {
			const num = u32(off + k * 8);
			const den = u32(off + k * 8 + 4) || 1;
			out.push(num / den);
		}
		return out;
	}
	return null;
}
function CameraGeotag({ photo, lat, lng, onChange }) {
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [hint, setHint] = (0, import_react.useState)(null);
	async function handleFile(file) {
		setBusy(true);
		setHint("Membaca foto dan koordinat…");
		try {
			const [compressed, exif, device] = await Promise.all([
				compressImage(file),
				readJpegGps(file),
				readDeviceGeo()
			]);
			const geo = exif ?? device;
			onChange({
				photo: compressed,
				lat: geo?.lat ?? lat,
				lng: geo?.lng ?? lng
			});
			setHint(geo ? `Koordinat tersimpan ${geo.lat.toFixed(6)}, ${geo.lng.toFixed(6)}` : "Foto tersimpan. Izinkan lokasi agar koordinat terisi otomatis.");
		} catch (err) {
			setHint(err instanceof Error ? err.message : "Gagal memproses foto");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-muted/40 p-3 sm:col-span-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "Kamera & geotag"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: "Ambil foto aset. Koordinat GPS dari kamera atau perangkat disimpan otomatis."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-start gap-3",
				children: [photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: photo,
					alt: "Foto aset",
					className: "h-28 w-36 rounded-md object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-28 w-36 place-items-center rounded-md border border-dashed border-border bg-card text-xs text-muted-foreground",
					children: "Belum ada foto"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "file",
							accept: "image/*",
							capture: "environment",
							className: "hidden",
							onChange: (e) => {
								const file = e.target.files?.[0];
								if (file) handleFile(file);
								e.target.value = "";
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								disabled: busy,
								onClick: () => inputRef.current?.click(),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }),
									" ",
									busy ? "Memproses…" : "Ambil / unggah foto"
								]
							}), photo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: "outline",
								onClick: () => {
									onChange({
										photo: null,
										lat,
										lng
									});
									setHint(null);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Hapus foto"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), lat != null && lng != null ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "Koordinat belum terisi"]
						}),
						hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-accent",
							children: hint
						}) : null
					]
				})]
			})
		]
	});
}
function nextRegister() {
	return `12.07.${(/* @__PURE__ */ new Date()).getFullYear()}.${Math.floor(1e3 + Math.random() * 9e3)}`;
}
var empty = {
	registerNo: "",
	kibCode: "1.3.2.05.01",
	kibGroup: "B",
	category: "alat_kantor",
	topology: "indoor",
	name: "",
	spec: "",
	brand: "",
	material: "",
	yearAcquired: (/* @__PURE__ */ new Date()).getFullYear(),
	quantity: 1,
	unit: "unit",
	unitPrice: 0,
	condition: "baik",
	roomId: "",
	outdoorSiteId: "",
	bidangId: "",
	sourceOfFunds: "APBD",
	serialNo: "",
	notes: "",
	masterId: "",
	lat: null,
	lng: null,
	photo: null
};
function fromAsset(a) {
	return {
		registerNo: a.registerNo,
		kibCode: a.kibCode,
		kibGroup: a.kibGroup,
		category: a.category,
		topology: a.topology,
		name: a.name,
		spec: a.spec ?? "",
		brand: a.brand ?? "",
		material: a.material ?? "",
		yearAcquired: a.yearAcquired,
		quantity: a.quantity,
		unit: a.unit,
		unitPrice: a.unitPrice,
		condition: a.condition,
		roomId: a.roomId ?? "",
		outdoorSiteId: a.outdoorSiteId ?? "",
		bidangId: a.bidangId ?? "",
		sourceOfFunds: a.sourceOfFunds ?? "",
		serialNo: a.serialNo ?? "",
		notes: a.notes ?? "",
		masterId: a.masterId ?? "",
		lat: a.lat,
		lng: a.lng,
		photo: a.photo
	};
}
function applyMaster(m) {
	return {
		masterId: m.id,
		name: m.name,
		brand: m.brand ?? "",
		spec: m.spec ?? "",
		material: m.material ?? "",
		category: m.category,
		kibGroup: m.kibGroup,
		kibCode: m.kibCode,
		unit: m.unit,
		topology: m.topology
	};
}
function AssetFormDialog({ open, onOpenChange, asset, defaults }) {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		...empty,
		...defaults
	});
	const [masterQ, setMasterQ] = (0, import_react.useState)("");
	const bidangs = useQuery({
		queryKey: ["bidangs"],
		queryFn: () => listBidangs(),
		enabled: open
	});
	const rooms = useQuery({
		queryKey: ["rooms"],
		queryFn: () => listRooms(),
		enabled: open
	});
	const sites = useQuery({
		queryKey: ["sites"],
		queryFn: () => listSites(),
		enabled: open
	});
	const masters = useQuery({
		queryKey: ["masters"],
		queryFn: () => listMasters(),
		enabled: open
	});
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				...form,
				registerNo: form.registerNo.trim() || nextRegister(),
				unitPrice: form.unitPrice ?? 0
			};
			if (asset) return updateAsset({ data: {
				...payload,
				id: asset.id
			} });
			return createAsset({ data: payload });
		},
		onSuccess: async () => {
			toast.success(asset ? "Aset diperbarui" : "Aset ditambahkan");
			await qc.invalidateQueries();
			onOpenChange(false);
		},
		onError: (err) => toast.error(err.message || "Gagal menyimpan")
	});
	function set(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	const filtered = (masters.data ?? []).filter((m) => {
		if (!m.active && m.id !== form.masterId) return false;
		const q = masterQ.trim().toLowerCase();
		if (!q) return true;
		return `${m.name} ${m.brand ?? ""} ${m.spec ?? ""} ${m.code}`.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (v) {
				setForm(asset ? fromAsset(asset) : {
					...empty,
					registerNo: nextRegister(),
					...defaults
				});
				setMasterQ("");
			}
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "w-[min(100%-1.5rem,48rem)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: asset ? "Ubah aset" : "Aset baru" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Pilih dari master data, lalu foto aset. Koordinat GPS tersimpan otomatis." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
						label: "Master data aset",
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Cari laptop, rambu, APILL, kertas…",
							value: masterQ,
							onChange: (e) => setMasterQ(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 grid max-h-36 grid-cols-1 gap-1 overflow-auto sm:grid-cols-2",
							children: filtered.slice(0, 12).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setForm((f) => ({
									...f,
									...applyMaster(m)
								})),
								className: `rounded-md border px-2 py-1.5 text-left text-xs ${form.masterId === m.id ? "border-accent bg-accent/10" : "border-border bg-card"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: m.brand ? `${m.brand} ${m.name}` : m.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-0.5 block text-[11px] text-muted-foreground",
									children: [
										m.code,
										" · ",
										CATEGORY_LABEL[m.category]
									]
								})]
							}, m.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nama barang",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.name,
							onChange: (e) => set("name", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraGeotag, {
						photo: form.photo ?? null,
						lat: form.lat ?? null,
						lng: form.lng ?? null,
						onChange: (next) => setForm((f) => ({
							...f,
							...next
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "No. register",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.registerNo,
							onChange: (e) => set("registerNo", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Kode barang",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.kibCode,
							onChange: (e) => set("kibCode", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Kelompok KIB",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
							value: form.kibGroup,
							onChange: (e) => set("kibGroup", e.target.value),
							children: KIB_GROUPS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: g,
								children: KIB_LABEL[g]
							}, g))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Kategori",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
							value: form.category,
							onChange: (e) => set("category", e.target.value),
							children: Object.entries(CATEGORY_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: v
							}, k))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Topologi",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
							value: form.topology,
							onChange: (e) => set("topology", e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "indoor",
								children: "Indoor · Kantor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "outdoor",
								children: "Outdoor · Jalan"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Kondisi",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
							value: form.condition,
							onChange: (e) => set("condition", e.target.value),
							children: Object.entries(CONDITION_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: v
							}, k))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Merk / tipe",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.brand ?? "",
							onChange: (e) => set("brand", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Spesifikasi",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.spec ?? "",
							onChange: (e) => set("spec", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bahan",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.material ?? "",
							onChange: (e) => set("material", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tahun perolehan",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: form.yearAcquired ?? "",
							onChange: (e) => set("yearAcquired", e.target.value ? Number(e.target.value) : null)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Jumlah",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							required: true,
							value: form.quantity,
							onChange: (e) => set("quantity", Number(e.target.value))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Satuan",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							value: form.unit,
							onChange: (e) => set("unit", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Bidang",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
							value: form.bidangId ?? "",
							onChange: (e) => set("bidangId", e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "—"
							}), (bidangs.data ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: b.id,
								children: b.shortName
							}, b.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Ruangan (indoor)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
							value: form.roomId ?? "",
							onChange: (e) => set("roomId", e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "—"
							}), (rooms.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r.id,
								children: r.name
							}, r.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Lokasi outdoor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectField, {
							value: form.outdoorSiteId ?? "",
							onChange: (e) => set("outdoorSiteId", e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "—"
							}), (sites.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s.id,
								children: s.name
							}, s.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Sumber dana",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.sourceOfFunds ?? "",
							onChange: (e) => set("sourceOfFunds", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "No. seri",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.serialNo ?? "",
							onChange: (e) => set("serialNo", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Keterangan",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: form.notes ?? "",
							onChange: (e) => set("notes", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Batal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: save.isPending,
							children: save.isPending ? "Menyimpan…" : "Simpan"
						})]
					})
				]
			})]
		})
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `grid gap-1.5 ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { AssetFormDialog as t };
