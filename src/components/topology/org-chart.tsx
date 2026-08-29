import { Link } from "@tanstack/react-router";
import type { Bidang, SubBidang } from "@/lib/simaset/types";

function Cell({
  title,
  name,
  nip,
  bidangId,
  seksi,
}: {
  title: string;
  name?: string | null;
  nip?: string | null;
  bidangId: string;
  seksi?: string;
}) {
  return (
    <Link
      to="/indoor/$bidangId"
      params={{ bidangId }}
      search={{ seksi }}
      className="block h-full rounded-xl bg-[#f4efe4] px-3 py-2.5 text-center text-[#17345a] shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
    >
      <p className="text-[10px] font-bold tracking-[0.06em] uppercase">{title}</p>
      {name ? <p className="mt-1 text-xs font-semibold leading-snug">{name}</p> : <p className="mt-1 text-xs opacity-50">—</p>}
      {nip ? <p className="mt-0.5 font-mono text-[10px] opacity-70">NIP. {nip}</p> : null}
    </Link>
  );
}

export function OrgChart({ bidangs, subs }: { bidangs: Bidang[]; subs: SubBidang[] }) {
  const byId = new Map(bidangs.map((b) => [b.id, b]));
  const kadis = byId.get("pimpinan");
  const sek = byId.get("sekretariat");
  const fung = byId.get("fungsional");
  const uptd = byId.get("upt-terminal");
  const columns = ["prasjal", "lalin", "angkutan", "lautudara"]
    .map((id) => byId.get(id))
    .filter(Boolean) as Bidang[];
  const findSub = (id: string) => subs.find((s) => s.id === id);
  const umum = findSub("sub-umum");
  const perencana = findSub("sub-perencana");
  const arsip = findSub("sub-tik");

  return (
    <div className="overflow-x-auto rounded-xl bg-[#17345a] p-4 text-[#f4efe4]">
      <p className="mb-4 text-center text-xs tracking-[0.2em] uppercase opacity-80">
        Struktur organisasi · klik kotak untuk membuka ruangan & aset
      </p>
      <div className="mx-auto flex min-w-[880px] flex-col items-center gap-3">
        <div className="grid w-full max-w-3xl grid-cols-2 gap-3">
          {kadis && (
            <Cell title="Plt. Kepala Dinas" name={kadis.headName} nip={kadis.headNip} bidangId={kadis.id} />
          )}
          {sek && <Cell title="Sekretaris" name={sek.headName} nip={sek.headNip} bidangId={sek.id} />}
        </div>

        <div className="grid w-full grid-cols-4 gap-2">
          {fung && (
            <Cell title="Kelompok Jabatan Fungsional Ahli Utama dan Ahli Madya" bidangId={fung.id} />
          )}
          {umum && (
            <Cell
              title="Kepala Sub Bagian Umum dan Kepegawaian"
              name={umum.headName}
              nip={umum.headNip}
              bidangId="sekretariat"
              seksi={umum.id}
            />
          )}
          {perencana && (
            <Cell
              title="Perencana Ahli Muda"
              name={perencana.headName}
              nip={perencana.headNip}
              bidangId="sekretariat"
              seksi={perencana.id}
            />
          )}
          {arsip && (
            <Cell
              title="Arsiparis Ahli Pertama"
              name={arsip.headName}
              nip={arsip.headNip}
              bidangId="sekretariat"
              seksi={arsip.id}
            />
          )}
        </div>

        <div className="grid w-full grid-cols-4 gap-2">
          {columns.map((b) => {
            const children = subs.filter((s) => s.bidangId === b.id);
            return (
              <div key={b.id} className="flex flex-col gap-2">
                <Cell title={b.name} name={b.headName} nip={b.headNip} bidangId={b.id} />
                {children.map((s) => (
                  <Cell
                    key={s.id}
                    title={s.name}
                    name={s.headName}
                    nip={s.headNip}
                    bidangId={b.id}
                    seksi={s.id}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {uptd && (
          <div className="w-full space-y-2">
            <div className="mx-auto max-w-xl">
              <Cell title={uptd.name} name={uptd.headName} nip={uptd.headNip} bidangId={uptd.id} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {subs
                .filter((s) => s.bidangId === uptd.id)
                .map((s) => (
                  <Cell
                    key={s.id}
                    title={s.name}
                    name={s.headName}
                    nip={s.headNip}
                    bidangId={uptd.id}
                    seksi={s.id}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
