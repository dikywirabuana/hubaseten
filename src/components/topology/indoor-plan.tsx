import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Bidang, Room } from "@/lib/simaset/types";
import { formatNumber } from "@/lib/simaset/format";
import { cn } from "@/lib/utils";

const FLOORS = ["Lantai 2", "Lantai 1", "Halaman"] as const;

export function IndoorPlan({ bidangs, rooms }: { bidangs: Bidang[]; rooms: Room[] }) {
  const [floor, setFloor] = useState<(typeof FLOORS)[number]>("Lantai 2");
  const floorRooms = rooms.filter((r) => r.floor === floor);
  const groups = bidangs
    .map((b) => ({ bidang: b, rooms: floorRooms.filter((r) => r.bidangId === b.id) }))
    .filter((g) => g.rooms.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FLOORS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFloor(f)}
            className={cn(
              "h-10 rounded-md px-4 text-sm font-medium",
              floor === f ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-xs tracking-wide text-muted-foreground uppercase">
          Kantor Dishub · KP3B Palima · {floor}
        </p>
        <div className="space-y-5">
          {groups.map(({ bidang, rooms: list }) => (
            <div key={bidang.id}>
              <p className="mb-2 text-xs font-medium tracking-wide text-accent uppercase">{bidang.shortName}</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((room) => (
                  <Link
                    key={room.id}
                    to="/rooms/$roomId"
                    params={{ roomId: room.id }}
                    className="group rounded-lg border border-border bg-paper p-3 transition-colors hover:border-accent"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium group-hover:text-accent">{room.name}</p>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {room.code.slice(-3)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{room.subBidangName ?? bidang.shortName}</p>
                    <p className="mt-2 text-xs tabular-nums">{formatNumber(room.assetCount)} barang</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
