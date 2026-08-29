-- Bulk KIB B/C/D rows are loaded by scripts/seed-kib.mjs (not inlined here —
-- a 3.5MB SQL file breaks the production build/migrate).
delete from assets;
delete from outdoor_sites;
