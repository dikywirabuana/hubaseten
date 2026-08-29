-- Perbaiki topologi: kendaraan di parkiran, furniture keluar dari parkir,
-- pos pelintasan sebagai lokasi outdoor, aset indoor tanpa ruangan ke gudang.

insert into outdoor_sites (id, code, name, corridor, kabupaten, km_label, lat, lng, site_type, description, sort_order)
values
  (
    'site-pos-pelintasan', 'OUT-POS-01',
    'Pos Pelintasan Kereta Api',
    'Perlintasan sebidang KA',
    'Provinsi Banten', 'Sebidang',
    -6.1205, 106.1504, 'pos',
    'Pos jaga pada perlintasan sebidang kereta api di wilayah Provinsi Banten.',
    200
  ),
  (
    'site-pos-jaga', 'OUT-POS-02',
    'Pos Jaga Permanen Jalan',
    'Pos jaga ruas provinsi',
    'Provinsi Banten', 'Pos jaga',
    -6.1442, 106.1145, 'pos',
    'Gedung pos jaga permanen/semi permanen pada ruas jalan dan kawasan operasional Dishub.',
    201
  )
on conflict (id) do update set
  name = excluded.name,
  site_type = excluded.site_type,
  description = excluded.description;

-- Furniture yang salah masuk kategori kendaraan
update assets
set category = 'alat_kantor',
    room_id = 'room-gudang-sek',
    topology = 'indoor',
    outdoor_site_id = null
where category = 'kendaraan'
  and (
    lower(name) like '%meja%'
    or lower(name) like '%kursi%'
    or lower(name) like '%lemari%'
    or lower(name) like '%rak %'
  );

-- Aset indoor tanpa ruangan → gudang stok
update assets
set room_id = 'room-gudang-atk'
where topology = 'indoor'
  and room_id is null
  and bidang_id = 'sekretariat';

update assets
set room_id = 'room-gudang-uptd'
where topology = 'indoor'
  and room_id is null
  and bidang_id = 'upt-terminal';

-- Pos pelintasan KA
update assets
set outdoor_site_id = 'site-pos-pelintasan',
    bidang_id = 'lautudara',
    topology = 'outdoor',
    room_id = null
where topology = 'outdoor'
  and (
    lower(coalesce(spec, '')) like '%perlintasan%'
    or lower(name) like '%perlintasan%'
  );

-- Pos jaga lain (bukan perlintasan)
update assets
set outdoor_site_id = 'site-pos-jaga',
    bidang_id = 'lautudara',
    topology = 'outdoor',
    room_id = null
where topology = 'outdoor'
  and lower(name) like '%pos jaga%'
  and outdoor_site_id is distinct from 'site-pos-pelintasan';
