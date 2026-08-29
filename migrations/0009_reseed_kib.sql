-- Muat ulang KIB agar titik peta memakai geotag (tanpa jitter acak).
delete from assets where id like 'kib-%';
delete from outdoor_sites;
