-- Muat ulang KIB agar plat nomor & BPKB kendaraan tersimpan.
delete from assets where id like 'kib-%';
delete from outdoor_sites where id like 's-%';
