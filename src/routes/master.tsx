import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Skeleton } from "@/components/ui/skeleton";
import { createMaster, deleteMaster, listMasters, updateMaster } from "@/lib/simaset/server";
import { CATEGORY_LABEL, KIB_GROUPS, KIB_LABEL, type AssetMaster, type Category, type StaffProfile, type Topology } from "@/lib/simaset/types";

export const Route = createFileRoute("/master")({ component: MasterPage });

function MasterPage() {
  return <Page>{(staff) => <MasterBody staff={staff} />}</Page>;
}

function MasterBody({ staff }: { staff: StaffProfile }) {
  const q = useQuery({ queryKey: ["masters"], queryFn: () => listMasters() });
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<AssetMaster | null>(null);
  const canEdit = staff.role === "admin" || staff.role === "operator";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Referensi</p>
          <h1 className="font-display mt-1 text-3xl font-semibold">Master data aset</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Katalog barang: kode, merk/tipe, KIB, satuan. Input aset memilih dari daftar ini.
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => { setEdit(null); setOpen(true); }}>
            <Plus className="size-4" /> Item baru
          </Button>
        )}
      </div>
      {q.isPending ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2.5 font-medium">Nama</th>
                <th className="px-3 py-2.5 font-medium">Kode</th>
                <th className="px-3 py-2.5 font-medium">Kategori</th>
                <th className="px-3 py-2.5 font-medium">Satuan</th>
                <th className="px-3 py-2.5 font-medium">Topologi</th>
                {canEdit && <th className="px-3 py-2.5 font-medium" />}
              </tr>
            </thead>
            <tbody>
              {(q.data ?? []).map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-3 py-2.5">
                    <p className="font-medium">{m.brand ? `${m.brand} ${m.name}` : m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.spec ?? "—"}</p>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-xs">{m.kibCode}</td>
                  <td className="px-3 py-2.5 text-xs">{CATEGORY_LABEL[m.category]}</td>
                  <td className="px-3 py-2.5">{m.unit}</td>
                  <td className="px-3 py-2.5 text-xs">{m.topology}</td>
                  {canEdit && (
                    <td className="px-3 py-2.5 text-right">
                      <Button size="sm" variant="outline" onClick={() => { setEdit(m); setOpen(true); }}>
                        Ubah
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <MasterDialog open={open} onOpenChange={setOpen} item={edit} staff={staff} />
    </div>
  );
}

function MasterDialog({
  open,
  onOpenChange,
  item,
  staff,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: AssetMaster | null;
  staff: StaffProfile;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    code: "",
    kibCode: "",
    kibGroup: "B",
    brand: "",
    spec: "",
    category: "alat_kantor" as Category,
    unit: "unit",
    material: "",
    topology: "indoor" as Topology,
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
        active: true,
      };
      if (item) return updateMaster({ data: { ...payload, id: item.id } });
      return createMaster({ data: payload });
    },
    onSuccess: async () => {
      toast.success("Master data disimpan");
      await qc.invalidateQueries({ queryKey: ["masters"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: () => deleteMaster({ data: { id: item!.id } }),
    onSuccess: async () => {
      toast.success("Master data dihapus");
      await qc.invalidateQueries({ queryKey: ["masters"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (v) {
          setForm({
            name: item?.name ?? "",
            code: item?.code ?? "",
            kibCode: item?.kibCode ?? "",
            kibGroup: item?.kibGroup ?? "B",
            brand: item?.brand ?? "",
            spec: item?.spec ?? "",
            category: item?.category ?? "alat_kantor",
            unit: item?.unit ?? "unit",
            material: item?.material ?? "",
            topology: item?.topology ?? "indoor",
          });
        }
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Ubah master data" : "Master data baru"}</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <label className="grid gap-1.5 sm:col-span-2">
            <Label>Nama barang</Label>
            <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="grid gap-1.5">
            <Label>Kode barang</Label>
            <Input required value={form.kibCode} onChange={(e) => setForm({ ...form, kibCode: e.target.value, code: e.target.value })} />
          </label>
          <label className="grid gap-1.5">
            <Label>KIB</Label>
            <SelectField value={form.kibGroup} onChange={(e) => setForm({ ...form, kibGroup: e.target.value })}>
              {KIB_GROUPS.map((g) => (
                <option key={g} value={g}>{KIB_LABEL[g]}</option>
              ))}
            </SelectField>
          </label>
          <label className="grid gap-1.5">
            <Label>Kategori</Label>
            <SelectField value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </SelectField>
          </label>
          <label className="grid gap-1.5">
            <Label>Topologi</Label>
            <SelectField value={form.topology} onChange={(e) => setForm({ ...form, topology: e.target.value as Topology })}>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </SelectField>
          </label>
          <label className="grid gap-1.5">
            <Label>Merk / tipe</Label>
            <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </label>
          <label className="grid gap-1.5">
            <Label>Satuan</Label>
            <Input required value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </label>
          <label className="grid gap-1.5 sm:col-span-2">
            <Label>Spesifikasi</Label>
            <Input value={form.spec} onChange={(e) => setForm({ ...form, spec: e.target.value })} />
          </label>
          <div className="flex justify-between gap-2 sm:col-span-2">
            {item && staff.role === "admin" ? (
              <Button type="button" variant="outline" onClick={() => { if (confirm("Hapus item master?")) del.mutate(); }}>
                <Trash2 className="size-4" /> Hapus
              </Button>
            ) : <span />}
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Menyimpan…" : "Simpan"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
