create table if not exists asset_masters (
  id text primary key,
  code text not null unique,
  name text not null,
  brand text,
  spec text,
  category text not null,
  kib_group text not null default 'B',
  kib_code text not null,
  unit text not null default 'unit',
  material text,
  topology text not null default 'indoor',
  active boolean not null default true,
  sort_order int not null default 0
);

alter table assets add column if not exists master_id text references asset_masters(id) on delete set null;
alter table assets add column if not exists lat numeric;
alter table assets add column if not exists lng numeric;
alter table assets add column if not exists photo text;

create index if not exists assets_master_idx on assets (master_id);

insert into asset_masters (id, code, name, brand, spec, category, kib_group, kib_code, unit, material, topology, sort_order) values
  ('m-laptop', '1.3.2.06.02', 'Laptop', null, 'Notebook dinas', 'alat_kantor', 'B', '1.3.2.06.02', 'unit', 'Logam', 'indoor', 1),
  ('m-pc', '1.3.2.06.01', 'Komputer PC', null, 'Desktop kantor', 'alat_kantor', 'B', '1.3.2.06.01', 'unit', 'Logam', 'indoor', 2),
  ('m-monitor', '1.3.2.06.08', 'Monitor', null, 'Layar LCD/LED', 'alat_kantor', 'B', '1.3.2.06.08', 'unit', 'Logam/kaca', 'indoor', 3),
  ('m-printer', '1.3.2.06.05', 'Printer', null, 'Printer kantor', 'alat_kantor', 'B', '1.3.2.06.05', 'unit', 'Logam', 'indoor', 4),
  ('m-scanner', '1.3.2.06.06', 'Scanner', null, 'Scanner dokumen', 'alat_kantor', 'B', '1.3.2.06.06', 'unit', 'Logam', 'indoor', 5),
  ('m-proyektor', '1.3.2.10.04', 'Proyektor', null, 'Infokus rapat', 'alat_kantor', 'B', '1.3.2.10.04', 'unit', 'Logam', 'indoor', 6),
  ('m-meja', '1.3.2.05.01', 'Meja kerja', null, 'Meja staf 140×70', 'alat_kantor', 'B', '1.3.2.05.01', 'unit', 'Kayu', 'indoor', 7),
  ('m-kursi', '1.3.2.05.02', 'Kursi kerja', null, 'Kursi putar staf', 'alat_kantor', 'B', '1.3.2.05.02', 'unit', 'Logam/kain', 'indoor', 8),
  ('m-filling', '1.3.2.05.04', 'Filling cabinet', null, 'Lemari arsip 4 laci', 'alat_kantor', 'B', '1.3.2.05.04', 'unit', 'Besi', 'indoor', 9),
  ('m-ac', '1.3.2.05.07', 'AC split', null, 'AC ruangan', 'alat_kantor', 'B', '1.3.2.05.07', 'unit', 'Logam', 'indoor', 10),
  ('m-ups', '1.3.2.06.04', 'UPS', null, 'Uninterruptible power supply', 'alat_kantor', 'B', '1.3.2.06.04', 'unit', 'Logam', 'indoor', 11),
  ('m-switch', '1.3.2.06.10', 'Switch jaringan', null, 'Switch managed', 'alat_kantor', 'B', '1.3.2.06.10', 'unit', 'Logam', 'indoor', 12),
  ('m-jam-dinding', '1.3.2.05.11', 'Jam dinding', null, 'Jam analog/digital', 'jam', 'B', '1.3.2.05.11', 'unit', 'Plastik', 'indoor', 13),
  ('m-absensi', '1.3.2.05.12', 'Mesin absensi', null, 'Fingerprint / face', 'jam', 'B', '1.3.2.05.12', 'unit', 'Logam', 'indoor', 14),
  ('m-rambu', '1.3.2.04.01', 'Rambu lalu lintas', null, 'Rambu jalan provinsi', 'perlengkapan_jalan', 'E', '1.3.2.04.01', 'buah', 'Logam', 'outdoor', 20),
  ('m-apill', '1.3.2.04.10', 'APILL', null, 'Alat pemberi isyarat lalu lintas', 'perlengkapan_jalan', 'E', '1.3.2.04.10', 'set', 'Logam', 'outdoor', 21),
  ('m-pju', '1.3.2.04.20', 'PJU LED', null, 'Penerangan jalan umum', 'perlengkapan_jalan', 'E', '1.3.2.04.20', 'titik', 'Logam', 'outdoor', 22),
  ('m-guardrail', '1.3.2.04.30', 'Guardrail', null, 'Pagar pengaman jalan', 'perlengkapan_jalan', 'D', '1.3.2.04.30', 'meter', 'Besi', 'outdoor', 23),
  ('m-marka', '1.3.2.04.40', 'Marka jalan', null, 'Marka thermoplastic', 'perlengkapan_jalan', 'D', '1.3.2.04.40', 'm2', 'Cat', 'outdoor', 24),
  ('m-vms', '1.3.2.04.50', 'VMS', null, 'Variable message sign', 'perlengkapan_jalan', 'E', '1.3.2.04.50', 'unit', 'Logam', 'outdoor', 25),
  ('m-cctv', '1.3.2.04.32', 'CCTV ITS', null, 'Kamera pengawas lalu lintas', 'perlengkapan_jalan', 'E', '1.3.2.04.32', 'titik', 'Logam', 'outdoor', 26),
  ('m-patok', '1.3.2.04.41', 'Patok kilometer', null, 'Patok KM ruas provinsi', 'perlengkapan_jalan', 'E', '1.3.2.04.41', 'buah', 'Beton', 'outdoor', 27),
  ('m-halte', '1.3.2.04.60', 'Halte', null, 'Halte angkutan umum', 'perlengkapan_jalan', 'C', '1.3.2.04.60', 'unit', 'Logam', 'outdoor', 28),
  ('m-kertas', '2.1.01.01', 'Kertas A4 80 gsm', null, 'Rim kertas fotokopi', 'atk', 'P', '2.1.01.01', 'rim', 'Kertas', 'indoor', 40),
  ('m-toner', '2.1.01.05', 'Toner / cartridge', null, 'Toner printer', 'atk', 'P', '2.1.01.05', 'buah', 'Plastik', 'indoor', 41),
  ('m-pulpen', '2.1.01.10', 'Pulpen', null, 'Alat tulis', 'atk', 'P', '2.1.01.10', 'lusin', 'Plastik', 'indoor', 42),
  ('m-map', '2.1.01.12', 'Map / ordner', null, 'Map arsip', 'atk', 'P', '2.1.01.12', 'buah', 'Kertas', 'indoor', 43),
  ('m-stempel', '2.1.01.20', 'Stempel dinas', null, 'Stempel basah', 'atk', 'P', '2.1.01.20', 'buah', 'Karet', 'indoor', 44)
on conflict (id) do nothing;
