-- Muat ulang titik sekolah ZOSS (KIB B) agar lokasi bisa dibuka di Street View.
delete from assets where id like 'kib-%';
delete from outdoor_sites where id like 's-%';
