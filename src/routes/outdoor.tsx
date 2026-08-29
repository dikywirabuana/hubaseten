import { Outlet, createFileRoute } from "@tanstack/react-router";

type OutdoorSearch = { lihat?: "ruas" | "titik" | "kib" };

export const Route = createFileRoute("/outdoor")({
  component: () => <Outlet />,
  validateSearch: (s: Record<string, unknown>): OutdoorSearch => ({
    lihat: s.lihat === "ruas" || s.lihat === "titik" || s.lihat === "kib" ? s.lihat : undefined,
  }),
});
