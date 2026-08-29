import type { ReactNode } from "react";
import type { StaffProfile } from "@/lib/simaset/types";
import { AppShell } from "./app-shell";
import { StaffGate } from "./staff-gate";

export function Page({ children }: { children: (staff: StaffProfile) => ReactNode }) {
  return (
    <StaffGate>
      {(staff) => <AppShell staff={staff}>{children(staff)}</AppShell>}
    </StaffGate>
  );
}
