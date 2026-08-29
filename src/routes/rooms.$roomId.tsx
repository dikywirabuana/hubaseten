import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Printer } from "lucide-react";
import { useState } from "react";
import { AssetFormDialog } from "@/components/assets/asset-form";
import { AssetTable } from "@/components/assets/asset-table";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoom } from "@/lib/simaset/server";
import { formatNumber } from "@/lib/simaset/format";
import type { StaffProfile } from "@/lib/simaset/types";

export const Route = createFileRoute("/rooms/$roomId")({ component: RoomPage });

function RoomPage() {
  const { roomId } = Route.useParams();
  return <Page>{(staff) => <RoomBody id={roomId} staff={staff} />}</Page>;
}

function RoomBody({ id, staff }: { id: string; staff: StaffProfile }) {
  const q = useQuery({ queryKey: ["room", id], queryFn: () => getRoom({ data: { id } }) });
  const [open, setOpen] = useState(false);
  if (q.isPending) return <Skeleton className="h-96" />;
  const data = q.data;
  if (!data) return <p>Ruangan tidak ditemukan.</p>;
  const { room, assets } = data;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            to="/indoor/$bidangId"
            params={{ bidangId: room.bidangId }}
            search={{ seksi: room.subBidangId ?? undefined }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← {room.bidangName}
          </Link>
          <h1 className="font-display mt-2 text-3xl font-semibold">{room.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {room.building} · {room.floor} · kode {room.code}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            PJ: {room.picName ?? "—"}
            {room.picNip ? ` · ${room.picNip}` : ""} · {formatNumber(room.assetCount)} barang
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/kir/$roomId" params={{ roomId: room.id }}>
              <Printer className="size-4" /> Cetak KIR
            </Link>
          </Button>
          {(staff.role === "admin" || staff.role === "operator") && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="size-4" /> Tambah
            </Button>
          )}
        </div>
      </div>
      <AssetTable assets={assets} staff={staff} />
      <AssetFormDialog
        open={open}
        onOpenChange={setOpen}
        defaults={{ topology: "indoor", roomId: room.id, bidangId: room.bidangId, category: "alat_kantor" }}
      />
    </div>
  );
}
