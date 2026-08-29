import { useQuery } from "@tanstack/react-query";
import { Clock3, ShieldX } from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile } from "@/lib/simaset/server";
import type { StaffProfile } from "@/lib/simaset/types";
import { LoginView } from "@/components/auth/login-view";
import { Button } from "@/components/ui/button";
import { Emblem } from "@/components/brand/emblem";

export function StaffGate({ children }: { children: (staff: StaffProfile) => ReactNode }) {
  const { user } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["staff-me", user?.id],
    enabled: Boolean(user),
    queryFn: () =>
      getMyProfile({
        data: {
          email: user?.primaryEmail ?? null,
          displayName: user?.displayName ?? null,
          photoUrl: user?.profileImageUrl ?? null,
        },
      }),
  });

  if (!user) return <LoginView />;
  if (profile.isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background text-foreground">
        <div className="text-center">
          <p className="font-display text-2xl">SIMASET</p>
          <p className="mt-2 text-sm text-muted-foreground">Memeriksa verifikasi akun Google…</p>
        </div>
      </main>
    );
  }
  if (profile.isError) {
    return (
      <HoldScreen
        title="Tidak dapat memuat profil"
        body="Sesi mungkin kedaluwarsa. Masuk ulang dengan akun Google dinas."
      />
    );
  }
  const staff = profile.data;
  if (!staff) return <LoginView />;
  if (staff.status === "pending") {
    return (
      <HoldScreen
        title="Menunggu verifikasi admin"
        body={`${staff.displayName ?? staff.email} sudah masuk. Admin SIMASET akan meninjau akun Google terdaftar sebelum akses inventaris dibuka.`}
        icon="wait"
      />
    );
  }
  if (staff.status === "rejected") {
    return (
      <HoldScreen
        title="Akses belum disetujui"
        body="Akun Google ini ditolak oleh administrator. Hubungi pengurus barang atau Kasubbag Umum Dishub Provinsi Banten."
        icon="deny"
      />
    );
  }
  return <>{children(staff)}</>;
}

function HoldScreen({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon?: "wait" | "deny";
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          {icon === "deny" ? (
            <ShieldX className="size-7" />
          ) : icon === "wait" ? (
            <Clock3 className="size-7" />
          ) : (
            <Emblem className="size-10 text-primary-foreground" />
          )}
        </div>
        <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          SIMASET · Dishub Banten
        </p>
        <h1 className="font-display mt-2 text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{body}</p>
        <Button variant="outline" className="mt-6" onClick={() => void signOut()}>
          Keluar
        </Button>
      </div>
    </main>
  );
}
