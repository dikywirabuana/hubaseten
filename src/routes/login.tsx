import { createFileRoute, Navigate } from "@tanstack/react-router";
import { LoginView } from "@/components/auth/login-view";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-sidebar text-sidebar-foreground">
        <p className="font-display text-xl">SIMASET</p>
        <p className="mt-2 text-sm text-sidebar-muted">Memuat sesi inventaris Dishub Banten…</p>
      </main>
    );
  }
  if (user) return <Navigate to="/" />;
  return <LoginView />;
}
