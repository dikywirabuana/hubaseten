alter table bidangs add column if not exists head_name text;
alter table bidangs add column if not exists head_nip text;
alter table sub_bidangs add column if not exists head_name text;
alter table sub_bidangs add column if not exists head_nip text;

update bidangs set
  name = 'Kepala Dinas',
  short_name = 'Pimpinan',
  kind = 'pimpinan',
  floor = 'Lantai 2',
  description = 'Kepala Dinas Perhubungan Provinsi Banten.',
  head_name = 'Tri Nurtopo, M.T.',
  head_nip = '19660530 199003 1 003',
  sort_order = 1
where id = 'pimpinan';

update bidangs set
  name = 'Sekretariat',
  short_name = 'Sekretariat',
  kind = 'secretariat',
  floor = 'Lantai 1',
  description = 'Unsur pembantu pimpinan: umum, kepegawaian, perencanaan, arsip, rumah tangga, dan fasilitas kantor.',
  head_name = 'Drs. Suska Deswianto',
  head_nip = '19691228 199203 1 002',
  sort_order = 2
where id = 'sekretariat';

update bidangs set
  name = 'Bidang Prasarana dan Perlengkapan Jalan',
  short_name = 'Prasjal',
  kind = 'bidang',
  floor = 'Lantai 2',
  description = 'Perlengkapan jalan, prasarana jalan, dan PJU pada jalan provinsi.',
  head_name = null,
  head_nip = null,
  sort_order = 3
where id = 'prasjal';

update bidangs set
  name = 'Bidang Lalu Lintas Jalan',
  short_name = 'Lalu Lintas',
  kind = 'bidang',
  floor = 'Lantai 2',
  description = 'Manajemen rekayasa lalu lintas, bina keselamatan, dan ruang ATCS.',
  head_name = 'Eneng Rahayu Ilyas, S.Pd., M.M.',
  head_nip = '19690408 199003 2 001',
  sort_order = 4
where id = 'lalin';

update bidangs set
  name = 'Bidang Angkutan dan Pengembangan Transportasi',
  short_name = 'Angkutan',
  kind = 'bidang',
  floor = 'Lantai 2',
  description = 'Angkutan jalan dan pengembangan sistem transportasi provinsi.',
  head_name = 'Verry Junanta, SE., M.Si',
  head_nip = '19750616 200112 1 003',
  sort_order = 5
where id = 'angkutan';

update bidangs set
  name = 'Bidang Perhubungan Laut, Udara dan Perkeretaapian',
  short_name = 'Laut·Udara·KA',
  kind = 'bidang',
  floor = 'Lantai 2',
  description = 'Kepelabuhanan, ASDP, perhubungan udara, dan perkeretaapian.',
  head_name = 'Moh. Amin, S.Sos',
  head_nip = '19670205 198801 1 002',
  sort_order = 6
where id = 'lautudara';

update rooms set bidang_id = 'upt-terminal' where bidang_id = 'upt-pkb';
update assets set bidang_id = 'upt-terminal' where bidang_id = 'upt-pkb';
update sub_bidangs set bidang_id = 'upt-terminal' where bidang_id = 'upt-pkb';
update staff_profiles set bidang_id = 'upt-terminal' where bidang_id = 'upt-pkb';
delete from bidangs where id = 'upt-pkb';

update bidangs set
  name = 'UPTD Pengelola Prasarana Perhubungan',
  short_name = 'UPTD P3',
  kind = 'upt',
  floor = 'Lantai 1',
  description = 'Unit pelaksana teknis pengelola prasarana perhubungan darat, laut, dan udara.',
  head_name = 'Bayu Adi Putranto, SE., M.M.',
  head_nip = '19850623 200912 1 002',
  sort_order = 7
where id = 'upt-terminal';

insert into bidangs (id, code, name, short_name, kind, floor, description, sort_order, head_name, head_nip)
values (
  'fungsional', '00', 'Kelompok Jabatan Fungsional', 'Fungsional', 'fungsional', 'Lantai 2',
  'Ahli Utama dan Ahli Madya pada Dinas Perhubungan Provinsi Banten.', 0, null, null
)
on conflict (id) do update set
  name = excluded.name, short_name = excluded.short_name, description = excluded.description, sort_order = excluded.sort_order;

insert into sub_bidangs (id, bidang_id, code, name, head_title, head_name, head_nip, sort_order) values
  ('sub-umum', 'sekretariat', '02.01', 'Sub Bagian Umum dan Kepegawaian', 'Kepala Sub Bagian', 'H. Tubagus Aan Ardhiawan, SE., M.Si', '19770703 200902 1 001', 1),
  ('sub-perencana', 'sekretariat', '02.02', 'Perencana Ahli Muda', 'Perencana Ahli Muda', 'Teddy Hendra Pratama, S.STP., M.Si', '19830708 200112 1 003', 2),
  ('sub-tik', 'sekretariat', '02.03', 'Arsiparis Ahli Pertama', 'Arsiparis Ahli Pertama', 'Munawati, SE., M.M.', '19790525 200801 2 006', 3),
  ('sub-tu', 'sekretariat', '02.04', 'Tata Usaha dan Rumah Tangga', 'Koordinator', null, null, 4),
  ('seksi-perlengkapan', 'prasjal', '03.01', 'Seksi Perlengkapan Jalan', 'Kepala Seksi', 'Rahmatullah, S.Kom.', '19740903 200112 1 013', 1),
  ('seksi-prasarana', 'prasjal', '03.02', 'Seksi Prasarana Jalan', 'Kepala Seksi', 'Drs. Dadi Herdia', '19720402 200003 1 001', 2),
  ('seksi-analis-prasjal', 'prasjal', '03.03', 'Analis Kebijakan Ahli Muda', 'Analis Kebijakan Ahli Muda', 'Yusuf Anwar, ATD., M.T.', '19690411 199303 1 002', 3),
  ('seksi-mrl', 'lalin', '04.01', 'Seksi Manajemen dan Rekayasa Lalu Lintas', 'Kepala Seksi', 'Ade Nurtaqin, SE., M.Si', '19780105 200112 1 001', 1),
  ('seksi-keselamatan', 'lalin', '04.02', 'Seksi Bina Keselamatan Lalu Lintas', 'Kepala Seksi', 'Kholid, S.Ag., M.Si', '19710909 200112 1 005', 2),
  ('seksi-analis-lalin', 'lalin', '04.03', 'Analis Kebijakan Ahli Muda', 'Analis Kebijakan Ahli Muda', 'Imam Arif Pribadi, S.Sos., M.Si', '19740131 199303 1 003', 3),
  ('seksi-angkutan', 'angkutan', '05.01', 'Seksi Angkutan Jalan', 'Kepala Seksi', 'Aldi Muhamad Firdaldi, SE., M.Si', '19760412 200112 1 002', 1),
  ('seksi-pengembangan', 'angkutan', '05.02', 'Seksi Pengembangan Transportasi', 'Kepala Seksi', 'Jejen Herlambang, ST., M.Si', '19760827 200112 1 003', 2),
  ('seksi-pranata', 'angkutan', '05.03', 'Pranata Komputer Ahli Muda', 'Pranata Komputer Ahli Muda', null, null, 3),
  ('seksi-asdp', 'lautudara', '06.01', 'Seksi Kepelabuhanan dan ASDP', 'Kepala Seksi', 'Imam Wahyu, SE., M.Si', '19750628 200112 1 003', 1),
  ('seksi-udara-ka', 'lautudara', '06.02', 'Seksi Perhubungan Udara dan Perkeretaapian', 'Kepala Seksi', 'Usep Herdiana, M.M.', '19710325 199112 1 004', 2),
  ('seksi-analis-laut', 'lautudara', '06.03', 'Analis Kebijakan Ahli Muda', 'Analis Kebijakan Ahli Muda', 'GPI Rakus Majiku, S.Kom., M.Si', '19810403 201101 1 001', 3),
  ('sub-term-ops', 'upt-terminal', '07.01', 'Seksi Sarana Perhubungan Darat dan Pengendalian Angkutan', 'Kepala Seksi', 'Sufriyanto Abbasaf, S.E.', '19690910 199203 1 007', 1),
  ('sub-pkb-uji', 'upt-terminal', '07.02', 'Seksi Prasarana Perhubungan Laut dan Perhubungan Udara', 'Kepala Seksi', null, null, 2),
  ('sub-uptd-tu', 'upt-terminal', '07.03', 'Sub Bagian Tata Usaha UPTD', 'Kepala Sub Bagian', 'Rahmat Gunawan, S.IP., S.Sos., M.M.', '19730706 200112 1 002', 3)
on conflict (id) do update set
  bidang_id = excluded.bidang_id,
  code = excluded.code,
  name = excluded.name,
  head_title = excluded.head_title,
  head_name = excluded.head_name,
  head_nip = excluded.head_nip,
  sort_order = excluded.sort_order;

insert into rooms (id, bidang_id, sub_bidang_id, code, name, floor, pic_name, pic_nip, area_m2, sort_order) values
  ('room-kadis', 'pimpinan', null, '12.07.01.01.001', 'Ruang Kepala Dinas', 'Lantai 2', 'Tri Nurtopo, M.T.', '19660530 199003 1 003', 42, 1),
  ('room-tamu-kadis', 'pimpinan', null, '12.07.01.01.004', 'Ruang Tamu Pimpinan', 'Lantai 2', 'Tri Nurtopo, M.T.', '19660530 199003 1 003', 24, 2),
  ('room-sekdis', 'sekretariat', 'sub-umum', '12.07.01.01.003', 'Ruang Sekretaris', 'Lantai 2', 'Drs. Suska Deswianto', '19691228 199203 1 002', 32, 1),
  ('room-rapat', 'sekretariat', 'sub-umum', '12.07.01.01.002', 'Ruang Rapat Utama', 'Lantai 2', 'Drs. Suska Deswianto', '19691228 199203 1 002', 86, 2),
  ('room-dwp', 'sekretariat', 'sub-tu', '12.07.01.02.015', 'Ruang DWP', 'Lantai 1', 'Pengurus DWP', null, 36, 3),
  ('room-lobby', 'sekretariat', 'sub-tu', '12.07.01.02.001', 'Lobi', 'Lantai 1', 'Petugas Protokol', null, 64, 4),
  ('room-umum', 'sekretariat', 'sub-umum', '12.07.01.02.002', 'Ruang Kasubag Umum dan Kepegawaian', 'Lantai 1', 'H. Tubagus Aan Ardhiawan, SE., M.Si', '19770703 200902 1 001', 48, 5),
  ('room-perencana', 'sekretariat', 'sub-perencana', '12.07.01.02.007', 'Ruang Perencana Ahli Muda', 'Lantai 1', 'Teddy Hendra Pratama, S.STP., M.Si', '19830708 200112 1 003', 20, 6),
  ('room-arsip', 'sekretariat', 'sub-tik', '12.07.01.02.004', 'Ruang Arsiparis', 'Lantai 1', 'Munawati, SE., M.M.', '19790525 200801 2 006', 28, 7),
  ('room-tu', 'sekretariat', 'sub-tu', '12.07.01.02.003', 'Ruang Staf Sekretariat', 'Lantai 1', 'Koordinator TU', null, 36, 8),
  ('room-server', 'sekretariat', 'sub-tik', '12.07.01.02.005', 'Ruang Server TIK', 'Lantai 1', 'Admin TIK', null, 18, 9),
  ('room-pantri-sek', 'sekretariat', 'sub-tu', '12.07.01.02.008', 'Pantri Sekretariat', 'Lantai 1', 'Pengurus Rumah Tangga', null, 12, 10),
  ('room-gudang-sek', 'sekretariat', 'sub-tu', '12.07.01.02.009', 'Gudang Kecil Sekretariat', 'Lantai 1', 'Pengurus Barang', null, 16, 11),
  ('room-gudang-atk', 'sekretariat', 'sub-tu', '12.07.01.02.006', 'Gudang Stok Barang', 'Lantai 1', 'Pengurus Barang', '19750505 200003 1 004', 40, 12),
  ('room-pamdal', 'sekretariat', 'sub-tu', '12.07.01.02.010', 'Pos Pamdal', 'Halaman', 'Komandan Piket', null, 10, 13),
  ('room-parkir', 'sekretariat', 'sub-tu', '12.07.01.02.011', 'Parkiran', 'Halaman', 'Petugas Parkir', null, 800, 14),
  ('room-voli', 'sekretariat', 'sub-tu', '12.07.01.02.012', 'Lapangan Voli', 'Halaman', 'Pengurus DWP', null, 162, 15),
  ('room-genset', 'sekretariat', 'sub-tu', '12.07.01.02.013', 'Ruang Genset', 'Halaman', 'Teknisi Listrik', null, 20, 16),
  ('room-bengkel', 'sekretariat', 'sub-tu', '12.07.01.02.014', 'Bengkel', 'Halaman', 'Kepala Bengkel', null, 48, 17),
  ('room-kabid-prasjal', 'prasjal', null, '12.07.01.06.001', 'Ruang Kepala Bidang Prasjal', 'Lantai 2', 'Kepala Bidang Prasarana dan Perlengkapan Jalan', null, 24, 1),
  ('room-seksi-perlengkapan', 'prasjal', 'seksi-perlengkapan', '12.07.01.06.002', 'Ruang Kasi Perlengkapan Jalan', 'Lantai 2', 'Rahmatullah, S.Kom.', '19740903 200112 1 013', 36, 2),
  ('room-seksi-prasarana', 'prasjal', 'seksi-prasarana', '12.07.01.06.003', 'Ruang Kasi Prasarana Jalan', 'Lantai 2', 'Drs. Dadi Herdia', '19720402 200003 1 001', 32, 3),
  ('room-analis-prasjal', 'prasjal', 'seksi-analis-prasjal', '12.07.01.06.004', 'Ruang Analis Kebijakan Prasjal', 'Lantai 2', 'Yusuf Anwar, ATD., M.T.', '19690411 199303 1 002', 16, 4),
  ('room-staf-prasjal', 'prasjal', 'seksi-perlengkapan', '12.07.01.06.005', 'Ruang Staf Prasjal', 'Lantai 2', 'Koordinator Staf', null, 40, 5),
  ('room-pantri-prasjal', 'prasjal', null, '12.07.01.06.006', 'Pantri Prasjal', 'Lantai 2', null, null, 8, 6),
  ('room-gudang-prasjal', 'prasjal', 'seksi-perlengkapan', '12.07.01.06.007', 'Gudang Kecil Prasjal', 'Lantai 2', 'Pengurus Barang Bidang', null, 14, 7),
  ('room-kabid-lalin', 'lalin', null, '12.07.01.05.001', 'Ruang Kepala Bidang Lalu Lintas', 'Lantai 2', 'Eneng Rahayu Ilyas, S.Pd., M.M.', '19690408 199003 2 001', 24, 1),
  ('room-seksi-mrl', 'lalin', 'seksi-mrl', '12.07.01.05.002', 'Ruang Kasi Manajemen Rekayasa Lalin', 'Lantai 2', 'Ade Nurtaqin, SE., M.Si', '19780105 200112 1 001', 30, 2),
  ('room-seksi-keselamatan', 'lalin', 'seksi-keselamatan', '12.07.01.05.003', 'Ruang Kasi Bina Keselamatan Lalin', 'Lantai 2', 'Kholid, S.Ag., M.Si', '19710909 200112 1 005', 28, 3),
  ('room-analis-lalin', 'lalin', 'seksi-analis-lalin', '12.07.01.05.004', 'Ruang Analis Kebijakan Lalin', 'Lantai 2', 'Imam Arif Pribadi, S.Sos., M.Si', '19740131 199303 1 003', 16, 4),
  ('room-staf-lalin', 'lalin', 'seksi-mrl', '12.07.01.05.005', 'Ruang Staf Lalu Lintas', 'Lantai 2', 'Koordinator Staf', null, 40, 5),
  ('room-atcs', 'lalin', 'seksi-mrl', '12.07.01.05.006', 'Ruang ATCS', 'Lantai 2', 'Operator ATCS', null, 48, 6),
  ('room-pantri-lalin', 'lalin', null, '12.07.01.05.007', 'Pantri Lalu Lintas', 'Lantai 2', null, null, 8, 7),
  ('room-gudang-lalin', 'lalin', 'seksi-keselamatan', '12.07.01.05.008', 'Gudang Kecil Lalu Lintas', 'Lantai 2', 'Pengurus Barang Bidang', null, 14, 8),
  ('room-kabid-angkutan', 'angkutan', null, '12.07.01.03.001', 'Ruang Kepala Bidang Angkutan', 'Lantai 2', 'Verry Junanta, SE., M.Si', '19750616 200112 1 003', 24, 1),
  ('room-seksi-angkutan', 'angkutan', 'seksi-angkutan', '12.07.01.03.002', 'Ruang Kasi Angkutan Jalan', 'Lantai 2', 'Aldi Muhamad Firdaldi, SE., M.Si', '19760412 200112 1 002', 32, 2),
  ('room-seksi-pengembangan', 'angkutan', 'seksi-pengembangan', '12.07.01.03.003', 'Ruang Kasi Pengembangan Transportasi', 'Lantai 2', 'Jejen Herlambang, ST., M.Si', '19760827 200112 1 003', 28, 3),
  ('room-pranata', 'angkutan', 'seksi-pranata', '12.07.01.03.004', 'Ruang Pranata Komputer', 'Lantai 2', 'Pranata Komputer Ahli Muda', null, 16, 4),
  ('room-staf-angkutan', 'angkutan', 'seksi-angkutan', '12.07.01.03.005', 'Ruang Staf Angkutan', 'Lantai 2', 'Koordinator Staf', null, 36, 5),
  ('room-pantri-angkutan', 'angkutan', null, '12.07.01.03.006', 'Pantri Angkutan', 'Lantai 2', null, null, 8, 6),
  ('room-gudang-angkutan', 'angkutan', 'seksi-angkutan', '12.07.01.03.007', 'Gudang Kecil Angkutan', 'Lantai 2', 'Pengurus Barang Bidang', null, 14, 7),
  ('room-kabid-laut', 'lautudara', null, '12.07.01.04.001', 'Ruang Kepala Bidang Laut, Udara dan KA', 'Lantai 2', 'Moh. Amin, S.Sos', '19670205 198801 1 002', 24, 1),
  ('room-seksi-asdp', 'lautudara', 'seksi-asdp', '12.07.01.04.002', 'Ruang Kasi Kepelabuhanan dan ASDP', 'Lantai 2', 'Imam Wahyu, SE., M.Si', '19750628 200112 1 003', 28, 2),
  ('room-seksi-udara', 'lautudara', 'seksi-udara-ka', '12.07.01.04.003', 'Ruang Kasi Udara dan Perkeretaapian', 'Lantai 2', 'Usep Herdiana, M.M.', '19710325 199112 1 004', 26, 3),
  ('room-analis-laut', 'lautudara', 'seksi-analis-laut', '12.07.01.04.004', 'Ruang Analis Kebijakan Laut Udara KA', 'Lantai 2', 'GPI Rakus Majiku, S.Kom., M.Si', '19810403 201101 1 001', 16, 4),
  ('room-staf-laut', 'lautudara', 'seksi-asdp', '12.07.01.04.005', 'Ruang Staf Laut Udara KA', 'Lantai 2', 'Koordinator Staf', null, 36, 5),
  ('room-pantri-laut', 'lautudara', null, '12.07.01.04.006', 'Pantri Laut Udara KA', 'Lantai 2', null, null, 8, 6),
  ('room-gudang-laut', 'lautudara', 'seksi-asdp', '12.07.01.04.007', 'Gudang Kecil Laut Udara KA', 'Lantai 2', 'Pengurus Barang Bidang', null, 14, 7),
  ('room-upt-terminal', 'upt-terminal', 'sub-uptd-tu', '12.07.01.07.001', 'Ruang Kepala UPTD', 'Lantai 1', 'Bayu Adi Putranto, SE., M.M.', '19850623 200912 1 002', 30, 1),
  ('room-kasi-darat-uptd', 'upt-terminal', 'sub-term-ops', '12.07.01.07.002', 'Ruang Kasi Sarana Darat UPTD', 'Lantai 1', 'Sufriyanto Abbasaf, S.E.', '19690910 199203 1 007', 24, 2),
  ('room-upt-pkb', 'upt-terminal', 'sub-pkb-uji', '12.07.01.08.001', 'Ruang Kasi Prasarana Laut dan Udara UPTD', 'Lantai 1', 'Kepala Seksi', null, 34, 3),
  ('room-tu-uptd', 'upt-terminal', 'sub-uptd-tu', '12.07.01.07.003', 'Ruang Kasubag Tata Usaha UPTD', 'Lantai 1', 'Rahmat Gunawan, S.IP., S.Sos., M.M.', '19730706 200112 1 002', 22, 4),
  ('room-staf-uptd', 'upt-terminal', 'sub-uptd-tu', '12.07.01.07.004', 'Ruang Staf UPTD', 'Lantai 1', 'Koordinator Staf', null, 32, 5),
  ('room-pantri-uptd', 'upt-terminal', 'sub-uptd-tu', '12.07.01.07.005', 'Pantri UPTD', 'Lantai 1', null, null, 8, 6),
  ('room-gudang-uptd', 'upt-terminal', 'sub-uptd-tu', '12.07.01.07.006', 'Gudang Kecil UPTD', 'Lantai 1', 'Pengurus Barang', null, 16, 7)
on conflict (id) do update set
  bidang_id = excluded.bidang_id,
  sub_bidang_id = excluded.sub_bidang_id,
  code = excluded.code,
  name = excluded.name,
  floor = excluded.floor,
  pic_name = excluded.pic_name,
  pic_nip = excluded.pic_nip,
  area_m2 = excluded.area_m2,
  sort_order = excluded.sort_order;

update assets set name = 'EliteDesk 800 G9', brand = 'HP', spec = 'Intel Core i7, RAM 16GB, SSD 512GB, monitor 27"' where id = 'a-003';
update assets set name = 'ThinkPad T14 Gen 4', brand = 'Lenovo', spec = 'AMD Ryzen 7, RAM 16GB, SSD 512GB' where id = 'a-012';
update assets set name = 'Veriton X', brand = 'Acer', spec = 'Intel Core i5, RAM 8GB, SSD 256GB' where id = 'a-017';
update assets set name = 'LaserJet Pro 4003', brand = 'HP', spec = 'Laser mono 38 ppm, A4' where id = 'a-018';
update assets set name = 'imageRUNNER 2645i', brand = 'Canon', spec = 'MFP digital A3' where id = 'a-019';
update assets set name = 'PowerEdge R250', brand = 'Dell', spec = 'Rak 24U, UPS 3 kVA' where id = 'a-022';
update assets set name = 'Catalyst 2960', brand = 'Cisco', spec = 'Switch gigabit 24 port managed' where id = 'a-023';
update assets set name = 'FortiGate 60F', brand = 'Fortinet', spec = 'UTM / firewall appliance' where id = 'a-024';
update assets set name = 'ExpertBook B5', brand = 'ASUS', spec = 'Intel Core i5, RAM 16GB, SSD 512GB' where id = 'a-026';
update assets set name = 'ProDesk 400 G9', brand = 'HP', spec = 'Intel Core i5, RAM 8GB, SSD 256GB' where id = 'a-028';
update assets set name = 'DesignJet T230', brand = 'HP', spec = 'Plotter A1' where id = 'a-029';
update assets set name = 'ThinkPad E14', brand = 'Lenovo', spec = 'Intel Core i5, RAM 16GB, SSD 512GB' where id = 'a-030';
update assets set name = 'Veriton S', brand = 'Acer', spec = 'Intel Core i5, RAM 8GB, SSD 256GB' where id = 'a-032';
update assets set name = 'EliteBook 840 G10', brand = 'HP', spec = 'Intel Core i7, RAM 16GB, SSD 512GB' where id = 'a-034';
update assets set name = 'Precision 3660', brand = 'Dell', spec = 'Intel Core i7, RAM 32GB, GPU workstation' where id = 'a-035';
update assets set name = 'ThinkPad E14', brand = 'Lenovo', spec = 'Intel Core i5, RAM 16GB, SSD 512GB' where id = 'a-037';
update assets set name = 'ProDesk 400 G9', brand = 'HP', spec = 'Intel Core i5, RAM 8GB, SSD 256GB' where id = 'a-039';
update assets set name = 'EcoTank L1300', brand = 'Epson', spec = 'Inkjet A3+' where id = 'a-040';
update assets set name = 'Veriton X', brand = 'Acer', spec = 'Intel Core i5, RAM 8GB, SSD 256GB' where id = 'a-042';
update assets set name = 'ScanSnap iX1600', brand = 'Fujitsu', spec = 'ADF duplex 40 ppm, A4' where id = 'a-046';

insert into assets (id, register_no, kib_code, kib_group, category, topology, name, spec, brand, material, year_acquired, quantity, unit, unit_price, condition, room_id, outdoor_site_id, bidang_id, source_of_funds, serial_no, notes) values
  ('n-001', '12.07.2.10.010.0001', '1.3.2.10.10', 'B', 'alat_kantor', 'indoor', 'Video wall 3×3', 'Panel 55 inci, kontroler wall', 'LG', 'Logam/kaca', 2024, 1, 'set', 185000000, 'baik', 'room-atcs', null, 'lalin', 'APBD', 'ATCS-VW-01', 'Ruang ATCS'),
  ('n-002', '12.07.2.06.030.0001', '1.3.2.06.07', 'B', 'alat_kantor', 'indoor', 'Z4 G5', 'Intel Xeon, RAM 64GB, GPU', 'HP', 'Logam', 2024, 4, 'unit', 32500000, 'baik', 'room-atcs', null, 'lalin', 'APBD', null, null),
  ('n-003', '12.07.2.06.030.0002', '1.3.2.06.08', 'B', 'alat_kantor', 'indoor', 'UltraSharp U2720Q', 'Monitor 27 inci 4K', 'Dell', 'Logam/kaca', 2024, 4, 'unit', 7200000, 'baik', 'room-atcs', null, 'lalin', 'APBD', null, null),
  ('n-004', '12.07.2.11.010.0001', '1.3.2.11.02', 'B', 'alat_kantor', 'indoor', 'XPR 5550e', 'Radio base ATCS UHF', 'Motorola', 'Logam', 2023, 2, 'unit', 12500000, 'baik', 'room-atcs', null, 'lalin', 'APBD', null, null),
  ('n-005', '12.07.2.06.030.0003', '1.3.2.06.04', 'B', 'alat_kantor', 'indoor', 'Smart-UPS 5 kVA', 'UPS online rak 5 kVA', 'APC', 'Logam', 2024, 1, 'unit', 28500000, 'baik', 'room-atcs', null, 'lalin', 'APBD', null, null),
  ('n-006', '12.07.2.05.030.0001', '1.3.2.05.07', 'B', 'alat_kantor', 'indoor', 'AC Cassette 3 PK', 'AC cassette inverter', 'Daikin', 'Logam', 2024, 2, 'unit', 14500000, 'baik', 'room-atcs', null, 'lalin', 'APBD', null, null),
  ('n-007', '12.07.2.05.031.0001', '1.3.2.05.01', 'B', 'alat_kantor', 'indoor', 'Meja kerja staf 140×70', 'Meja HPL 140 cm', 'Olympic', 'Kayu', 2022, 8, 'unit', 1850000, 'baik', 'room-staf-lalin', null, 'lalin', 'APBD', null, null),
  ('n-008', '12.07.2.05.031.0002', '1.3.2.05.01', 'B', 'alat_kantor', 'indoor', 'Meja kerja staf 140×70', 'Meja HPL 140 cm', 'Olympic', 'Kayu', 2022, 8, 'unit', 1850000, 'baik', 'room-staf-prasjal', null, 'prasjal', 'APBD', null, null),
  ('n-009', '12.07.2.05.031.0003', '1.3.2.05.01', 'B', 'alat_kantor', 'indoor', 'Meja kerja staf 140×70', 'Meja HPL 140 cm', 'Olympic', 'Kayu', 2022, 6, 'unit', 1850000, 'baik', 'room-staf-angkutan', null, 'angkutan', 'APBD', null, null),
  ('n-010', '12.07.2.05.031.0004', '1.3.2.05.01', 'B', 'alat_kantor', 'indoor', 'Meja kerja staf 140×70', 'Meja HPL 140 cm', 'Olympic', 'Kayu', 2022, 6, 'unit', 1850000, 'baik', 'room-staf-laut', null, 'lautudara', 'APBD', null, null),
  ('n-011', '12.07.2.05.032.0001', '1.3.2.05.13', 'B', 'alat_kantor', 'indoor', 'Kulkas 2 pintu 300 L', 'Lemari es 2 pintu', 'Polytron', 'Logam', 2021, 1, 'unit', 3200000, 'baik', 'room-pantri-sek', null, 'sekretariat', 'APBD', null, null),
  ('n-012', '12.07.2.05.032.0002', '1.3.2.05.14', 'B', 'alat_kantor', 'indoor', 'Dispenser galon bawah', 'Dispenser hot & cold', 'Miyako', 'Plastik', 2022, 1, 'unit', 650000, 'baik', 'room-pantri-sek', null, 'sekretariat', 'APBD', null, null),
  ('n-013', '12.07.2.05.032.0003', '1.3.2.05.13', 'B', 'alat_kantor', 'indoor', 'Kulkas 1 pintu 150 L', 'Lemari es 1 pintu', 'Sharp', 'Logam', 2021, 1, 'unit', 2100000, 'baik', 'room-pantri-lalin', null, 'lalin', 'APBD', null, null),
  ('n-014', '12.07.2.05.032.0004', '1.3.2.05.13', 'B', 'alat_kantor', 'indoor', 'Kulkas 1 pintu 150 L', 'Lemari es 1 pintu', 'Sharp', 'Logam', 2021, 1, 'unit', 2100000, 'baik', 'room-pantri-prasjal', null, 'prasjal', 'APBD', null, null),
  ('n-015', '12.07.2.05.032.0005', '1.3.2.05.13', 'B', 'alat_kantor', 'indoor', 'Kulkas 1 pintu 150 L', 'Lemari es 1 pintu', 'Polytron', 'Logam', 2022, 1, 'unit', 2100000, 'baik', 'room-pantri-angkutan', null, 'angkutan', 'APBD', null, null),
  ('n-016', '12.07.2.05.032.0006', '1.3.2.05.13', 'B', 'alat_kantor', 'indoor', 'Kulkas 1 pintu 150 L', 'Lemari es 1 pintu', 'Polytron', 'Logam', 2022, 1, 'unit', 2100000, 'baik', 'room-pantri-laut', null, 'lautudara', 'APBD', null, null),
  ('n-017', '12.07.2.13.001.0001', '1.3.2.13.01', 'B', 'alat_kantor', 'indoor', 'Genset 100 kVA', 'Generator diesel silent 100 kVA', 'Cummins', 'Logam', 2020, 1, 'unit', 185000000, 'baik', 'room-genset', null, 'sekretariat', 'APBD', 'GS-PLM-01', null),
  ('n-018', '12.07.2.13.002.0001', '1.3.2.13.02', 'B', 'alat_kantor', 'indoor', 'Kompresor angin 3 HP', 'Kompresor bengkel', 'Lakoni', 'Logam', 2021, 1, 'unit', 4500000, 'baik', 'room-bengkel', null, 'sekretariat', 'APBD', null, null),
  ('n-019', '12.07.2.13.002.0002', '1.3.2.13.03', 'B', 'alat_kantor', 'indoor', 'Toolbox 7 laci', 'Rak perkakas baja', 'Krisbow', 'Besi', 2021, 2, 'unit', 2800000, 'baik', 'room-bengkel', null, 'sekretariat', 'APBD', null, null),
  ('n-020', '12.07.2.04.030.0001', '1.3.2.04.51', 'E', 'perlengkapan_jalan', 'indoor', 'Barrier gate 4 m', 'Palang parkir otomatis', 'FAAC', 'Logam', 2022, 2, 'unit', 18500000, 'baik', 'room-parkir', null, 'sekretariat', 'APBD', null, null),
  ('n-021', '12.07.2.04.030.0002', '1.3.2.04.32', 'E', 'perlengkapan_jalan', 'indoor', 'DS-2CD2087G2', 'CCTV bullet 4K area parkir', 'Hikvision', 'Logam', 2023, 6, 'titik', 4200000, 'baik', 'room-parkir', null, 'sekretariat', 'APBD', null, null),
  ('n-022', '12.07.2.14.001.0001', '1.3.2.14.01', 'B', 'alat_kantor', 'indoor', 'Tiang net voli', 'Tiang + net standar', 'Generic', 'Besi/nilon', 2019, 1, 'set', 3500000, 'baik', 'room-voli', null, 'sekretariat', 'APBD', null, null),
  ('n-023', '12.07.2.11.011.0001', '1.3.2.11.01', 'B', 'alat_kantor', 'indoor', 'XIR P3688', 'Radio HT digital 5W', 'Motorola', 'Plastik', 2023, 6, 'unit', 1850000, 'baik', 'room-pamdal', null, 'sekretariat', 'APBD', null, null),
  ('n-024', '12.07.2.06.031.0001', '1.3.2.06.09', 'B', 'alat_kantor', 'indoor', 'DS-7608NI', 'DVR 8 kanal + monitor 24"', 'Hikvision', 'Logam', 2023, 1, 'set', 6400000, 'baik', 'room-pamdal', null, 'sekretariat', 'APBD', null, null),
  ('n-025', '12.07.2.05.033.0001', '1.3.2.05.01', 'B', 'alat_kantor', 'indoor', 'Meja rapat 12 kursi', 'Meja rapat 360 cm', 'Olympic', 'Kayu', 2020, 1, 'set', 8500000, 'baik', 'room-dwp', null, 'sekretariat', 'APBD', null, null),
  ('n-026', '12.07.2.05.033.0002', '1.3.2.10.05', 'B', 'alat_kantor', 'indoor', 'ZA-212', 'Speaker aktif 12 inci', 'TOA', 'Logam', 2021, 2, 'unit', 3200000, 'baik', 'room-dwp', null, 'sekretariat', 'APBD', null, null),
  ('n-027', '12.07.2.06.032.0001', '1.3.2.06.02', 'B', 'alat_kantor', 'indoor', 'Vostro 3530', 'Intel Core i5, RAM 8GB, SSD 256GB', 'Dell', 'Logam', 2024, 1, 'unit', 9800000, 'baik', 'room-perencana', null, 'sekretariat', 'APBD', null, null),
  ('n-028', '12.07.2.06.032.0002', '1.3.2.06.02', 'B', 'alat_kantor', 'indoor', 'IdeaPad Slim 3', 'Intel Core i5, RAM 8GB, SSD 512GB', 'Lenovo', 'Logam', 2024, 1, 'unit', 8900000, 'baik', 'room-analis-prasjal', null, 'prasjal', 'APBD', null, null),
  ('n-029', '12.07.2.06.032.0003', '1.3.2.06.02', 'B', 'alat_kantor', 'indoor', 'IdeaPad Slim 3', 'Intel Core i5, RAM 8GB, SSD 512GB', 'Lenovo', 'Logam', 2024, 1, 'unit', 8900000, 'baik', 'room-analis-lalin', null, 'lalin', 'APBD', null, null),
  ('n-030', '12.07.2.06.032.0004', '1.3.2.06.02', 'B', 'alat_kantor', 'indoor', 'VivoBook 14', 'Intel Core i5, RAM 8GB, SSD 512GB', 'ASUS', 'Logam', 2024, 1, 'unit', 9200000, 'baik', 'room-pranata', null, 'angkutan', 'APBD', null, null),
  ('n-031', '12.07.2.06.032.0005', '1.3.2.06.02', 'B', 'alat_kantor', 'indoor', 'VivoBook 14', 'Intel Core i5, RAM 8GB, SSD 512GB', 'ASUS', 'Logam', 2024, 1, 'unit', 9200000, 'baik', 'room-analis-laut', null, 'lautudara', 'APBD', null, null),
  ('n-032', '12.07.2.05.034.0001', '1.3.2.05.04', 'B', 'alat_kantor', 'indoor', 'Filling cabinet 4 laci', 'Steel cabinet', 'Lion', 'Besi', 2020, 2, 'unit', 1450000, 'baik', 'room-gudang-prasjal', null, 'prasjal', 'APBD', null, null),
  ('n-033', '12.07.2.05.034.0002', '1.3.2.05.04', 'B', 'alat_kantor', 'indoor', 'Filling cabinet 4 laci', 'Steel cabinet', 'Lion', 'Besi', 2020, 2, 'unit', 1450000, 'baik', 'room-gudang-lalin', null, 'lalin', 'APBD', null, null),
  ('n-034', '12.07.2.05.034.0003', '1.3.2.05.04', 'B', 'alat_kantor', 'indoor', 'Filling cabinet 4 laci', 'Steel cabinet', 'Lion', 'Besi', 2020, 2, 'unit', 1450000, 'baik', 'room-gudang-angkutan', null, 'angkutan', 'APBD', null, null),
  ('n-035', '12.07.2.05.034.0004', '1.3.2.05.04', 'B', 'alat_kantor', 'indoor', 'Filling cabinet 4 laci', 'Steel cabinet', 'Lion', 'Besi', 2020, 2, 'unit', 1450000, 'baik', 'room-gudang-laut', null, 'lautudara', 'APBD', null, null),
  ('n-036', '12.07.2.05.035.0001', '1.3.2.05.01', 'B', 'alat_kantor', 'indoor', 'Meja kerja 140×70', 'Meja HPL 140 cm', 'Olympic', 'Kayu', 2022, 4, 'unit', 1850000, 'baik', 'room-staf-uptd', null, 'upt-terminal', 'APBD', null, null),
  ('n-037', '12.07.2.05.035.0002', '1.3.2.05.01', 'B', 'alat_kantor', 'indoor', 'Meja kerja 140×70', 'Meja HPL 140 cm', 'Olympic', 'Kayu', 2021, 2, 'unit', 1850000, 'baik', 'room-tu-uptd', null, 'upt-terminal', 'APBD', null, null),
  ('n-038', '12.07.2.05.035.0003', '1.3.2.05.08', 'B', 'alat_kantor', 'indoor', 'Sofa tamu 2+1', 'Sofa ruang tamu pimpinan', 'Informaco', 'Kulit sintetis', 2021, 1, 'set', 6500000, 'baik', 'room-tamu-kadis', null, 'pimpinan', 'APBD', null, null),
  ('n-039', '12.07.2.05.020.0011', '1.3.2.05.11', 'B', 'jam', 'indoor', 'IQ-01', 'Jam dinding analog 35 cm', 'Seiko', 'Plastik', 2022, 1, 'unit', 280000, 'baik', 'room-atcs', null, 'lalin', 'APBD', null, null),
  ('n-040', '12.07.2.05.020.0012', '1.3.2.05.12', 'B', 'jam', 'indoor', 'GJD-LED80', 'Jam digital LED 80 cm', 'GJD', 'Logam', 2023, 1, 'unit', 2750000, 'baik', 'room-pamdal', null, 'sekretariat', 'APBD', null, null)
on conflict (id) do nothing;
