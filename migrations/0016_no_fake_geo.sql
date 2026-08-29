-- Hapus semua koordinat perkiraan. Titik GPS hanya dari kamera geotag.
update assets set lat = null, lng = null;
update outdoor_sites set lat = null, lng = null;
delete from assets where id like 'kib-%';
delete from outdoor_sites where id like 's-%';
