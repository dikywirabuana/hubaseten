import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, MapPinned, Plus, Route as RouteIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Page } from "@/components/layout/page";
import { AssetFormDialog } from "@/components/assets/asset-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NetworkMap } from "@/components/topology/network-map";
import { BrandLockup } from "@/components/brand/seals";
import { getDashboard, listSites } from "@/lib/simaset/server";
import { categoryLabel, conditionLabel, formatNumber } from "@/lib/simaset/format";
import { CATEGORY_LABEL, KIB_LABEL, type KibGroup } from "@/lib/simaset/types";
import type { StaffProfile } from "@/lib/simaset/types";
import { loadJaringan, type JaringanMeta } from "@/lib/simaset/jaringan";

export const Route = createFileRoute("/")({ component: Home });

const PIE_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-warn)",
  "#0f766e",
  "#1d4ed8",
  "var(--color-muted-foreground)",
  "#9a3412",
];

function Home() {
  return <Page>{(staff) => <Dashboard staff={staff} />}</Page>;
}

function Dashboard({ staff }: { staff: StaffProfile }) {
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });
  const sites = useQuery({ queryKey: ["sites"], queryFn: () => listSites() });
  const jaringan = useQuery({ queryKey: ["jaringan-meta"], queryFn: () => loadJaringan().then((d) => d.meta) });
  const [open, setOpen] = useState(false);
  if (dash.isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }
  const d = dash.data;
  if (!d) return <p className="text-sm text-muted-foreground">Gagal memuat dasbor.</p>;
  const catData = d.byCategory.map((c) => ({
    name: categoryLabel(c.category),
    value: c.count,
  }));
  const condData = d.byCondition.map((c) => ({
    name: conditionLabel(c.condition),
    value: c.count,
  }));
  const ruasPerKab = Object.entries(jaringan.data?.ruasPerKabupaten ?? {}).map(([name, count]) => ({
    name: name.replace("KAB. ", "").replace("KOTA ", ""),
    count,
  }));
  return (
    <div className="space-y-6">
      <Hero meta={jaringan.data} staff={staff} onAdd={() => setOpen(true)} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Stat
          label="Total aset"
          value={formatNumber(d.totalAssets)}
          hint="KIB B · C · D"
          to="/assets"
        />
        <Stat
          label="Ruas jalan"
          value={formatNumber(jaringan.data?.ruas ?? d.siteCount)}
          hint="jalan provinsi"
          icon={<RouteIcon className="size-4" />}
          to="/outdoor"
          search={{ lihat: "ruas" }}
        />
        <Stat
          label="Titik lapangan"
          value={formatNumber(jaringan.data?.titik ?? 0)}
          hint="rambu · PJU · APILL"
          icon={<MapPinned className="size-4" />}
          to="/outdoor"
          search={{ lihat: "titik" }}
        />
        <Stat
          label="Outdoor KIB"
          value={formatNumber(d.outdoorCount)}
          hint={`${d.siteCount} lokasi`}
          to="/assets"
          search={{ topology: "outdoor" }}
        />
        <Stat
          label="Indoor"
          value={formatNumber(d.indoorCount)}
          hint={`${d.roomCount} ruangan`}
          icon={<Building2 className="size-4" />}
          to="/assets"
          search={{ topology: "indoor" }}
        />
        <Stat label="Ruangan" value={formatNumber(d.roomCount)} hint="kantor KP3B" to="/indoor" />
      </div>

      {sites.isPending ? <Skeleton className="h-[32rem]" /> : <NetworkMap sites={sites.data ?? []} />}

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Statistik jumlah ruas jalan</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ruasPerKab.length ? ruasPerKab : d.byBidang} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey={ruasPerKab.length ? "name" : "shortName"} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(v) => formatNumber(Number(v ?? 0))}
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
                />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Komposisi KIB</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80}>
                  {catData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2">
              {d.byKib.map((c) => (
                <Link key={c.kibGroup} to="/assets" search={{ kibGroup: c.kibGroup as KibGroup }}>
                  <Badge variant="muted" className="hover:bg-accent/20">
                    {KIB_LABEL[c.kibGroup as keyof typeof KIB_LABEL] ?? c.kibGroup} · {c.count}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kondisi barang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {condData.map((c) => {
              const pct = d.totalAssets ? Math.round((c.value / d.totalAssets) * 100) : 0;
              return (
                <div key={c.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{c.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {c.value} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Aset per kabupaten / kota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {d.byKabupaten.slice(0, 8).map((s) => (
              <Link
                key={s.kabupaten}
                to="/outdoor"
                search={{ lihat: "kib" }}
                className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted"
              >
                <div>
                  <p className="text-sm font-medium">{s.kabupaten}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(s.siteCount)} lokasi</p>
                </div>
                <span className="text-sm tabular-nums">{formatNumber(s.assetCount)}</span>
              </Link>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              {d.byCategory.map((c) => (
                <Link key={c.category} to="/assets" search={{ category: c.category }}>
                  <Badge variant="muted" className="hover:bg-accent/20">
                    {CATEGORY_LABEL[c.category]} · {c.count}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/indoor" className="rounded-xl border border-border bg-card p-5 hover:border-accent">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Topologi indoor</p>
          <p className="font-display mt-1 text-2xl">Kantor per bidang</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ruang Kadis hingga UPT, lengkap dengan KIR per ruangan.
          </p>
        </Link>
        <Link to="/outdoor" className="rounded-xl border border-border bg-card p-5 hover:border-accent">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Topologi outdoor</p>
          <p className="font-display mt-1 text-2xl">Perlengkapan jalan</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Jaringan ruas provinsi, rambu, PJU, dan aset KIB D.
          </p>
        </Link>
      </div>
      <AssetFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function Hero({
  meta,
  staff,
  onAdd,
}: {
  meta?: JaringanMeta;
  staff: StaffProfile;
  onAdd: () => void;
}) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border">
      <img
        src="/brand/hero-jalan.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-sidebar/80" />
      <div className="relative flex flex-wrap items-end justify-between gap-4 px-5 py-8 text-sidebar-foreground sm:px-8">
        <div className="max-w-2xl">
          <BrandLockup />
          <p className="mt-5 text-xs tracking-[0.22em] text-sidebar-muted uppercase">Dashboard Maps</p>
          <h1 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">
            Visualisasi data perlengkapan jalan
          </h1>
          <p className="mt-2 max-w-xl text-sm text-sidebar-muted">
            Sistem Informasi Manajemen Aset Dinas Perhubungan Provinsi Banten — jaringan {meta?.ruas ?? 93}{" "}
            ruas jalan provinsi, titik lapangan, dan inventaris KIB indoor/outdoor.
          </p>
        </div>
        {(staff.role === "admin" || staff.role === "operator") && (
          <Button onClick={onAdd} className="bg-paper text-ink hover:opacity-90">
            <Plus className="size-4" /> Aset baru
          </Button>
        )}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
  icon,
  to,
  search,
}: {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
  to?: "/assets" | "/outdoor" | "/indoor";
  search?: Record<string, string>;
}) {
  const body = (
    <Card className={to ? "h-full transition hover:border-accent hover:shadow-sm" : undefined}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between text-muted-foreground">
          <p className="text-xs tracking-wide uppercase">{label}</p>
          {icon}
        </div>
        <p className="mt-2 font-display text-2xl font-semibold tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
  if (!to) return body;
  return (
    <Link to={to} search={search} className="block outline-none focus-visible:ring-2 focus-visible:ring-accent">
      {body}
    </Link>
  );
}
