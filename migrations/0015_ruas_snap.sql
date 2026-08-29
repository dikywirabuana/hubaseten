-- Snap koordinat ruas ke jalur SIMANTAP, bukan centroid kota.
delete from assets where id like 'kib-%';
delete from outdoor_sites where id like 's-%';
