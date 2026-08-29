import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAsset } from "@/lib/simaset/server";
import { categoryLabel, conditionLabel, displayAssetName, displayAssetType, formatNumber, vehicleBpkb, vehiclePlate } from "@/lib/simaset/format";
import { locationStreetViewUrl } from "@/lib/simaset/geo";
import { conditionVariant } from "@/lib/simaset/condition-badge";
import type { Asset, StaffProfile } from "@/lib/simaset/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AssetFormDialog } from "./asset-form";

export function AssetTable({ assets, staff }: { assets: Asset[]; staff: StaffProfile }) {
  const [edit, setEdit] = useState<Asset | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const qc = useQueryClient();
  const canEdit = staff.role === "admin" || staff.role === "operator";
  const del = useMutation({
    mutationFn: (id: string) => deleteAsset({ data: { id } }),
    onSuccess: async () => {
      toast.success("Aset dihapus");
      await qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (assets.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
        Belum ada aset pada saringan ini.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-3 py-2.5 font-medium">Barang</th>
              <th className="px-3 py-2.5 font-medium">Register</th>
              <th className="px-3 py-2.5 font-medium">Lokasi</th>
              <th className="px-3 py-2.5 font-medium">TA</th>
              <th className="px-3 py-2.5 font-medium">Jml</th>
              <th className="px-3 py-2.5 font-medium">Geotag</th>
              <th className="px-3 py-2.5 font-medium">Kondisi</th>
              {canEdit && <th className="px-3 py-2.5 font-medium" />}
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {a.photo ? (
                      <button type="button" onClick={() => setPreview(a.photo)} className="shrink-0">
                        <img src={a.photo} alt="" className="size-10 rounded object-cover" />
                      </button>
                    ) : null}
                    <div>
                      <p className="font-medium">{displayAssetName(a)}</p>
                      <p className="text-xs text-muted-foreground">
                        {displayAssetType(a) || categoryLabel(a.category)}
                      </p>
                      {a.category === "kendaraan" ? (
                        <p className="mt-1 font-mono text-xs text-foreground">
                          {vehiclePlate(a.serialNo) ? `Plat ${vehiclePlate(a.serialNo)}` : "Plat —"}
                          {vehicleBpkb(a.notes) ? ` · BPKB ${vehicleBpkb(a.notes)}` : ""}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs">{a.registerNo}</td>
                <td className="px-3 py-2.5 text-xs">
                  {(() => {
                    const label = a.topology === "indoor" ? a.roomName : a.outdoorSiteName;
                    if (!label) return <span className="text-muted-foreground">—</span>;
                    if (a.topology === "indoor") return <span>{label}</span>;
                    const href = locationStreetViewUrl({ lat: a.lat, lng: a.lng, name: label });
                    if (!href) return <span>{label}</span>;
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        title="Buka di Google Street View"
                        className="inline-flex items-center gap-1 text-accent hover:underline"
                      >
                        {label}
                        <ExternalLink className="size-3 shrink-0" />
                      </a>
                    );
                  })()}
                </td>
                <td className="px-3 py-2.5 tabular-nums text-xs">
                  {a.yearAcquired ?? "—"}
                </td>
                <td className="px-3 py-2.5 tabular-nums">
                  {formatNumber(a.quantity)} {a.unit}
                </td>
                <td className="px-3 py-2.5 font-mono text-[11px]">
                  {(() => {
                    const label = a.topology === "outdoor" ? a.outdoorSiteName : a.roomName;
                    const href = locationStreetViewUrl({ lat: a.lat, lng: a.lng, name: a.topology === "outdoor" ? label : null });
                    if (href) {
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          title="Buka lokasi di Google Maps"
                          className="inline-flex items-center gap-1 text-accent hover:underline"
                        >
                          {a.lat != null && a.lng != null ? `${a.lat.toFixed(5)}, ${a.lng.toFixed(5)}` : "Peta"}
                          <ExternalLink className="size-3 shrink-0" />
                        </a>
                      );
                    }
                    return <span className="text-muted-foreground">—</span>;
                  })()}
                </td>
                <td className="px-3 py-2.5">
                  <Badge variant={conditionVariant(a.condition)}>{conditionLabel(a.condition)}</Badge>
                </td>
                {canEdit && (
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    <Button variant="ghost" size="icon" aria-label="Ubah" onClick={() => setEdit(a)}>
                      <Pencil className="size-4" />
                    </Button>
                    {staff.role === "admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Hapus"
                        onClick={() => {
                          if (confirm(`Hapus ${a.name}?`)) del.mutate(a.id);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AssetFormDialog open={Boolean(edit)} onOpenChange={(v) => !v && setEdit(null)} asset={edit} />
      {preview ? (
        <button
          type="button"
          className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-6"
          onClick={() => setPreview(null)}
        >
          <img src={preview} alt="Foto aset" className="max-h-[80vh] max-w-full rounded-lg" />
        </button>
      ) : null}
    </>
  );
}
