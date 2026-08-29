import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  Building2,
  LayoutDashboard,
  MapPinned,
  Menu,
  Paperclip,
  Printer,
  BookOpen,
  Users,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import type { StaffProfile } from "@/lib/simaset/types";
import { ROLE_LABEL } from "@/lib/simaset/types";
import { BrandLockup } from "@/components/brand/seals";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: "Dashboard",
    items: [{ to: "/", label: "Dashboard Maps", icon: LayoutDashboard }],
  },
  {
    title: "Topologi",
    items: [
      { to: "/indoor", label: "Indoor · Kantor", icon: Building2 },
      { to: "/outdoor", label: "Outdoor · Jalan", icon: MapPinned },
    ],
  },
  {
    title: "Main content",
    items: [
      { to: "/assets", label: "Aset perlengkapan", icon: Boxes },
      { to: "/atk", label: "ATK & persediaan", icon: Paperclip },
      { to: "/kir", label: "Cetak KIR", icon: Printer },
    ],
  },
  {
    title: "Master data",
    items: [{ to: "/master", label: "Master perlengkapan", icon: BookOpen }],
  },
] as const;

export function AppShell({ staff, children }: { staff: StaffProfile; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-background">
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <NavBody staff={staff} />
      </aside>
      <div className="md:pl-64 print:pl-0">
        <header className="no-print sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Sistem Informasi Manajemen Aset</p>
            <p className="truncate text-xs text-muted-foreground">Dinas Perhubungan Provinsi Banten</p>
          </div>
          <UserChip staff={staff} />
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8 print:p-0">{children}</div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <NavBody staff={staff} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NavBody({ staff, onNavigate }: { staff: StaffProfile; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5">
        <BrandLockup />
      </div>
      <nav className="flex flex-1 flex-col gap-4 overflow-auto px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1 text-[10px] tracking-[0.16em] text-sidebar-muted uppercase">{group.title}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-foreground/12 text-sidebar-foreground"
                        : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {staff.role === "admin" && (
          <div>
            <p className="px-3 pb-1 text-[10px] tracking-[0.16em] text-sidebar-muted uppercase">Pengguna</p>
            <Link
              to="/users"
              onClick={onNavigate}
              className={cn(
                "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                pathname.startsWith("/users")
                  ? "bg-sidebar-foreground/12 text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Users className="size-4 shrink-0" />
              Verifikasi akun
            </Link>
          </div>
        )}
      </nav>
      <p className="px-5 py-4 text-[11px] leading-relaxed text-sidebar-muted">
        Kantor KP3B Palima, Serang · Jaringan ruas provinsi
      </p>
    </div>
  );
}

function UserChip({ staff }: { staff: StaffProfile }) {
  const user = useCurrentUser();
  const label = staff.displayName ?? user?.displayName ?? staff.email;
  return (
    <div className="flex items-center gap-2">
      {staff.photoUrl || user?.profileImageUrl ? (
        <img
          src={staff.photoUrl ?? user?.profileImageUrl ?? ""}
          alt=""
          className="size-8 rounded-full object-cover"
        />
      ) : (
        <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {label.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="hidden min-w-0 sm:block">
        <p className="max-w-36 truncate text-sm font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">{ROLE_LABEL[staff.role]}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => void signOut()}>
        Keluar
      </Button>
    </div>
  );
}
