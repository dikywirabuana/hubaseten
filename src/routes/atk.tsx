import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AssetFormDialog } from "@/components/assets/asset-form";
import { AssetTable } from "@/components/assets/asset-table";
import { Page } from "@/components/layout/page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listAssets } from "@/lib/simaset/server";
import { formatNumber } from "@/lib/simaset/format";
import type { StaffProfile } from "@/lib/simaset/types";

export const Route = createFileRoute("/atk")({ component: AtkPage });

function AtkPage() {
  return <Page>{(staff) => <AtkBody staff={staff} />}</Page>;
}

function AtkBody({ staff }: { staff: StaffProfile }) {
  const list = useQuery({
    queryKey: ["assets", { category: "atk" }],
    queryFn: () => listAssets({ data: { category: "atk", limit: 500 } }),
  });
  const [open, setOpen] = useState(false);
  const items = list.data?.items ?? [];
  const sku = items.length;
  const qty = items.reduce((s, a) => s + a.quantity, 0);
  const baik = items.filter((a) => a.condition === "baik").length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Persediaan</p>
          <h1 className="font-display mt-1 text-3xl font-semibold">ATK dan rumah tangga</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Stok gudang Subbag Umum: kertas, toner, map, stempel, formulir KIR, dan kelengkapan tata usaha.
          </p>
        </div>
        {(staff.role === "admin" || staff.role === "operator") && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Stok baru
          </Button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Jenis barang</p>
            <p className="mt-1 font-display text-2xl tabular-nums">{formatNumber(sku)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Jumlah stok</p>
            <p className="mt-1 font-display text-2xl tabular-nums">{formatNumber(qty)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase">Kondisi baik</p>
            <p className="mt-1 font-display text-2xl tabular-nums">{formatNumber(baik)}</p>
          </CardContent>
        </Card>
      </div>
      {list.isPending ? <Skeleton className="h-64" /> : <AssetTable assets={items} staff={staff} />}
      <AssetFormDialog
        open={open}
        onOpenChange={setOpen}
        defaults={{
          category: "atk",
          topology: "indoor",
          kibGroup: "P",
          kibCode: "2.1.01.01",
          roomId: "room-gudang-atk",
          bidangId: "sekretariat",
          unit: "buah",
        }}
      />
    </div>
  );
}
