import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Page } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { Skeleton } from "@/components/ui/skeleton";
import { listStaff, verifyStaff } from "@/lib/simaset/server";
import { ROLE_LABEL, type Role, type StaffProfile } from "@/lib/simaset/types";

export const Route = createFileRoute("/users")({ component: UsersPage });

function UsersPage() {
  return <Page>{(staff) => (staff.role === "admin" ? <UsersBody /> : <Navigate to="/" />)}</Page>;
}

function UsersBody() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["staff"], queryFn: () => listStaff() });
  const mut = useMutation({
    mutationFn: (data: { userId: string; status: "pending" | "approved" | "rejected"; role: Role }) =>
      verifyStaff({ data }),
    onSuccess: async () => {
      toast.success("Status akun diperbarui");
      await qc.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  if (q.isPending) return <Skeleton className="h-64" />;
  const rows = q.data ?? [];
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Keamanan akses</p>
        <h1 className="font-display mt-1 text-3xl font-semibold">Verifikasi akun Google</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Hanya akun yang disetujui admin yang dapat membuka inventaris. Pengguna pertama otomatis menjadi
          administrator.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-3 py-2.5 font-medium">Akun</th>
              <th className="px-3 py-2.5 font-medium">Peran</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <StaffRow key={u.userId} staff={u} busy={mut.isPending} onAction={(d) => mut.mutate(d)} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StaffRow({
  staff,
  busy,
  onAction,
}: {
  staff: StaffProfile;
  busy: boolean;
  onAction: (d: { userId: string; status: "pending" | "approved" | "rejected"; role: Role }) => void;
}) {
  return (
    <tr className="border-t border-border">
      <td className="px-3 py-3">
        <p className="font-medium">{staff.displayName ?? "Tanpa nama"}</p>
        <p className="text-xs text-muted-foreground">{staff.email}</p>
      </td>
      <td className="px-3 py-3">
        <SelectField
          className="h-9 w-40"
          value={staff.role}
          disabled={busy}
          onChange={(e) =>
            onAction({
              userId: staff.userId,
              status: staff.status,
              role: e.target.value as Role,
            })
          }
        >
          {Object.entries(ROLE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </SelectField>
      </td>
      <td className="px-3 py-3">
        <Badge
          variant={staff.status === "approved" ? "good" : staff.status === "pending" ? "warn" : "bad"}
        >
          {staff.status === "approved" ? "Disetujui" : staff.status === "pending" ? "Menunggu" : "Ditolak"}
        </Badge>
      </td>
      <td className="px-3 py-3 text-right">
        {staff.status !== "approved" && (
          <Button
            size="sm"
            disabled={busy}
            onClick={() => onAction({ userId: staff.userId, status: "approved", role: staff.role })}
          >
            Setujui
          </Button>
        )}
        {staff.status !== "rejected" && (
          <Button
            size="sm"
            variant="outline"
            className="ml-2"
            disabled={busy}
            onClick={() => onAction({ userId: staff.userId, status: "rejected", role: staff.role })}
          >
            Tolak
          </Button>
        )}
      </td>
    </tr>
  );
}
