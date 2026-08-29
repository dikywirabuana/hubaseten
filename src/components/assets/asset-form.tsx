import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { createAsset, listBidangs, listMasters, listRooms, listSites, updateAsset } from "@/lib/simaset/server";
import type { Asset, AssetInput, AssetMaster, Category, Condition, Topology } from "@/lib/simaset/types";
import { CATEGORY_LABEL, CONDITION_LABEL, KIB_GROUPS, KIB_LABEL } from "@/lib/simaset/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { CameraGeotag } from "./camera-geotag";

function nextRegister(): string {
  const y = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `12.07.${y}.${n}`;
}

const empty: AssetInput = {
  registerNo: "",
  kibCode: "1.3.2.05.01",
  kibGroup: "B",
  category: "alat_kantor",
  topology: "indoor",
  name: "",
  spec: "",
  brand: "",
  material: "",
  yearAcquired: new Date().getFullYear(),
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
  photo: null,
};

function fromAsset(a: Asset): AssetInput {
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
    photo: a.photo,
  };
}

function applyMaster(m: AssetMaster): Partial<AssetInput> {
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
    topology: m.topology,
  };
}

export function AssetFormDialog({
  open,
  onOpenChange,
  asset,
  defaults,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  asset?: Asset | null;
  defaults?: Partial<AssetInput>;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<AssetInput>({ ...empty, ...defaults });
  const [masterQ, setMasterQ] = useState("");
  const bidangs = useQuery({ queryKey: ["bidangs"], queryFn: () => listBidangs(), enabled: open });
  const rooms = useQuery({ queryKey: ["rooms"], queryFn: () => listRooms(), enabled: open });
  const sites = useQuery({ queryKey: ["sites"], queryFn: () => listSites(), enabled: open });
  const masters = useQuery({ queryKey: ["masters"], queryFn: () => listMasters(), enabled: open });

  const save = useMutation({
    mutationFn: async () => {
      const payload: AssetInput = {
        ...form,
        registerNo: form.registerNo.trim() || nextRegister(),
        unitPrice: form.unitPrice ?? 0,
      };
      if (asset) return updateAsset({ data: { ...payload, id: asset.id } });
      return createAsset({ data: payload });
    },
    onSuccess: async () => {
      toast.success(asset ? "Aset diperbarui" : "Aset ditambahkan");
      await qc.invalidateQueries();
      onOpenChange(false);
    },
    onError: (err: Error) => toast.error(err.message || "Gagal menyimpan"),
  });

  function set<K extends keyof AssetInput>(key: K, value: AssetInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const filtered = (masters.data ?? []).filter((m) => {
    if (!m.active && m.id !== form.masterId) return false;
    const q = masterQ.trim().toLowerCase();
    if (!q) return true;
    return `${m.name} ${m.brand ?? ""} ${m.spec ?? ""} ${m.code}`.toLowerCase().includes(q);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) {
          setForm(
            asset
              ? fromAsset(asset)
              : { ...empty, registerNo: nextRegister(), ...defaults },
          );
          setMasterQ("");
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="w-[min(100%-1.5rem,48rem)]">
        <DialogHeader>
          <DialogTitle>{asset ? "Ubah aset" : "Aset baru"}</DialogTitle>
          <DialogDescription>
            Pilih dari master data, lalu foto aset. Koordinat GPS tersimpan otomatis.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Field label="Master data aset" className="sm:col-span-2">
            <Input
              placeholder="Cari laptop, rambu, APILL, kertas…"
              value={masterQ}
              onChange={(e) => setMasterQ(e.target.value)}
            />
            <div className="mt-2 grid max-h-36 grid-cols-1 gap-1 overflow-auto sm:grid-cols-2">
              {filtered.slice(0, 12).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, ...applyMaster(m) }))}
                  className={`rounded-md border px-2 py-1.5 text-left text-xs ${
                    form.masterId === m.id ? "border-accent bg-accent/10" : "border-border bg-card"
                  }`}
                >
                  <span className="font-medium">{m.brand ? `${m.brand} ${m.name}` : m.name}</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {m.code} · {CATEGORY_LABEL[m.category]}
                  </span>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Nama barang" className="sm:col-span-2">
            <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <CameraGeotag
            photo={form.photo ?? null}
            lat={form.lat ?? null}
            lng={form.lng ?? null}
            onChange={(next) => setForm((f) => ({ ...f, ...next }))}
          />
          <Field label="No. register">
            <Input required value={form.registerNo} onChange={(e) => set("registerNo", e.target.value)} />
          </Field>
          <Field label="Kode barang">
            <Input required value={form.kibCode} onChange={(e) => set("kibCode", e.target.value)} />
          </Field>
          <Field label="Kelompok KIB">
            <SelectField value={form.kibGroup} onChange={(e) => set("kibGroup", e.target.value)}>
              {KIB_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {KIB_LABEL[g]}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Kategori">
            <SelectField value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Topologi">
            <SelectField value={form.topology} onChange={(e) => set("topology", e.target.value as Topology)}>
              <option value="indoor">Indoor · Kantor</option>
              <option value="outdoor">Outdoor · Jalan</option>
            </SelectField>
          </Field>
          <Field label="Kondisi">
            <SelectField value={form.condition} onChange={(e) => set("condition", e.target.value as Condition)}>
              {Object.entries(CONDITION_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Merk / tipe">
            <Input value={form.brand ?? ""} onChange={(e) => set("brand", e.target.value)} />
          </Field>
          <Field label="Spesifikasi">
            <Input value={form.spec ?? ""} onChange={(e) => set("spec", e.target.value)} />
          </Field>
          <Field label="Bahan">
            <Input value={form.material ?? ""} onChange={(e) => set("material", e.target.value)} />
          </Field>
          <Field label="Tahun perolehan">
            <Input
              type="number"
              value={form.yearAcquired ?? ""}
              onChange={(e) => set("yearAcquired", e.target.value ? Number(e.target.value) : null)}
            />
          </Field>
          <Field label="Jumlah">
            <Input
              type="number"
              min={0}
              required
              value={form.quantity}
              onChange={(e) => set("quantity", Number(e.target.value))}
            />
          </Field>
          <Field label="Satuan">
            <Input required value={form.unit} onChange={(e) => set("unit", e.target.value)} />
          </Field>
          <Field label="Bidang">
            <SelectField value={form.bidangId ?? ""} onChange={(e) => set("bidangId", e.target.value)}>
              <option value="">—</option>
              {(bidangs.data ?? []).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.shortName}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Ruangan (indoor)">
            <SelectField value={form.roomId ?? ""} onChange={(e) => set("roomId", e.target.value)}>
              <option value="">—</option>
              {(rooms.data ?? []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Lokasi outdoor">
            <SelectField
              value={form.outdoorSiteId ?? ""}
              onChange={(e) => set("outdoorSiteId", e.target.value)}
            >
              <option value="">—</option>
              {(sites.data ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectField>
          </Field>
          <Field label="Sumber dana">
            <Input value={form.sourceOfFunds ?? ""} onChange={(e) => set("sourceOfFunds", e.target.value)} />
          </Field>
          <Field label="Plat nomor / no. seri">
            <Input
              value={form.serialNo ?? ""}
              onChange={(e) => set("serialNo", e.target.value)}
              placeholder="Contoh: A 1025"
            />
          </Field>
          <Field label="Keterangan" className="sm:col-span-2">
            <Textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
          </Field>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}
