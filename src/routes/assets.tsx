import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AssetFormDialog } from "@/components/assets/asset-form";
import { AssetTable } from "@/components/assets/asset-table";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { Skeleton } from "@/components/ui/skeleton";
import { listAssets } from "@/lib/simaset/server";
import { formatNumber } from "@/lib/simaset/format";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  CONDITION_LABEL,
  KIB_GROUPS,
  KIB_LABEL,
  type Category,
  type Condition,
  type KibGroup,
  type StaffProfile,
  type Topology,
} from "@/lib/simaset/types";

type AssetSearch = {
  topology?: Topology;
  category?: Category;
  kibGroup?: KibGroup;
};

export const Route = createFileRoute("/assets")({
  component: AssetsPage,
  validateSearch: (s: Record<string, unknown>): AssetSearch => ({
    topology: s.topology === "indoor" || s.topology === "outdoor" ? s.topology : undefined,
    category: CATEGORIES.includes(s.category as Category) ? (s.category as Category) : undefined,
    kibGroup: KIB_GROUPS.includes(s.kibGroup as KibGroup) ? (s.kibGroup as KibGroup) : undefined,
  }),
});

const PAGE = 100;

function AssetsPage() {
  return <Page>{(staff) => <AssetsBody staff={staff} />}</Page>;
}

function AssetsBody({ staff }: { staff: StaffProfile }) {
  const search = Route.useSearch();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category | "">(search.category ?? "");
  const [topology, setTopology] = useState<Topology | "">(search.topology ?? "");
  const [condition, setCondition] = useState<Condition | "">("");
  const [kibGroup, setKibGroup] = useState<KibGroup | "">(search.kibGroup ?? "");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setCategory(search.category ?? "");
    setTopology(search.topology ?? "");
    setKibGroup(search.kibGroup ?? "");
    setPage(0);
  }, [search.category, search.topology, search.kibGroup]);
  const filter = useMemo(
    () => ({
      q: q || undefined,
      category: category || undefined,
      topology: topology || undefined,
      condition: condition || undefined,
      kibGroup: kibGroup || undefined,
      limit: PAGE,
      offset: page * PAGE,
    }),
    [q, category, topology, condition, kibGroup, page],
  );
  const list = useQuery({
    queryKey: ["assets", filter],
    queryFn: () => listAssets({ data: filter }),
  });
  const total = list.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE));
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Register barang</p>
          <h1 className="font-display mt-1 text-3xl font-semibold">Seluruh aset</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Data KIB B, C, dan D Dishub Banten · {formatNumber(total)} barang
          </p>
        </div>
        {(staff.role === "admin" || staff.role === "operator") && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Aset baru
          </Button>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          placeholder="Cari nama, register, merk…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
        />
        <SelectField
          value={kibGroup}
          onChange={(e) => {
            setKibGroup(e.target.value as KibGroup | "");
            setPage(0);
          }}
        >
          <option value="">Semua KIB</option>
          {(["B", "C", "D", "E", "P"] as KibGroup[]).map((g) => (
            <option key={g} value={g}>
              {KIB_LABEL[g]}
            </option>
          ))}
        </SelectField>
        <SelectField
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as Category | "");
            setPage(0);
          }}
        >
          <option value="">Semua kategori</option>
          {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </SelectField>
        <SelectField
          value={topology}
          onChange={(e) => {
            setTopology(e.target.value as Topology | "");
            setPage(0);
          }}
        >
          <option value="">Indoor & outdoor</option>
          <option value="indoor">Indoor</option>
          <option value="outdoor">Outdoor</option>
        </SelectField>
        <SelectField
          value={condition}
          onChange={(e) => {
            setCondition(e.target.value as Condition | "");
            setPage(0);
          }}
        >
          <option value="">Semua kondisi</option>
          {Object.entries(CONDITION_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </SelectField>
      </div>
      {list.isPending ? (
        <Skeleton className="h-64" />
      ) : (
        <AssetTable assets={list.data?.items ?? []} staff={staff} />
      )}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          Halaman {page + 1} dari {pages}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Berikutnya
          </Button>
        </div>
      </div>
      <AssetFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
