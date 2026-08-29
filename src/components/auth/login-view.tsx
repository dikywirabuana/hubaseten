import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { BantenSeal, DishubSeal } from "@/components/brand/seals";
import { Button } from "@/components/ui/button";

export function LoginView() {
  const google = GROK_PROVIDERS.find((p) => p.idp === "google");
  return (
    <main className="relative min-h-dvh overflow-hidden bg-sidebar text-sidebar-foreground">
      <img
        src="/brand/hero-jalan.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-sidebar/80" />
      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12">
        <div className="rounded-xl border border-sidebar-foreground/10 bg-sidebar/70 p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <BantenSeal className="size-14 shrink-0 object-contain" />
            <DishubSeal className="size-14 shrink-0 object-contain" />
            <div>
              <p className="font-display text-2xl leading-none">SIMASET</p>
              <p className="mt-1 text-xs tracking-[0.16em] text-sidebar-muted uppercase">
                Dinas Perhubungan Provinsi Banten
              </p>
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold">Masuk inventaris aset</h1>
          <p className="mt-3 text-sm leading-relaxed text-sidebar-muted">
            Visualisasi perlengkapan jalan, ruangan kantor, dan Kartu Inventaris Ruangan. Gunakan akun
            Google terdaftar — administrator memverifikasi sebelum data dibuka.
          </p>
          {authEnabled && google ? (
            <Button
              className="mt-8 h-12 w-full bg-paper text-ink hover:opacity-90"
              onClick={() => signIn(google.providerId, { callbackURL: "/" })}
            >
              Masuk dengan Google
            </Button>
          ) : (
            <p className="mt-6 text-sm text-sidebar-muted">Masuk belum diaktifkan.</p>
          )}
          <p className="mt-6 text-xs text-sidebar-muted">
            Pengguna pertama yang masuk otomatis menjadi administrator. Pengguna berikutnya menunggu
            persetujuan.
          </p>
        </div>
      </div>
    </main>
  );
}
