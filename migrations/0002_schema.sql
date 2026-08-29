-- SIMASET Dishub Banten — organizational + inventory schema

create table if not exists staff_profiles (
  user_id text primary key,
  email text not null,
  display_name text,
  photo_url text,
  role text not null default 'operator',
  status text not null default 'pending',
  bidang_id text,
  notes text,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bidangs (
  id text primary key,
  code text not null unique,
  name text not null,
  short_name text not null,
  kind text not null,
  floor text,
  description text,
  sort_order int not null default 0
);

create table if not exists sub_bidangs (
  id text primary key,
  bidang_id text not null references bidangs(id) on delete cascade,
  code text not null,
  name text not null,
  head_title text,
  sort_order int not null default 0
);

create table if not exists rooms (
  id text primary key,
  bidang_id text not null references bidangs(id) on delete cascade,
  sub_bidang_id text references sub_bidangs(id) on delete set null,
  code text not null unique,
  name text not null,
  floor text not null,
  building text not null default 'Kantor Dishub Provinsi Banten — KP3B Palima',
  pic_name text,
  pic_nip text,
  area_m2 numeric,
  sort_order int not null default 0
);

create table if not exists outdoor_sites (
  id text primary key,
  code text not null unique,
  name text not null,
  corridor text,
  kabupaten text,
  km_label text,
  lat numeric,
  lng numeric,
  site_type text not null,
  description text,
  sort_order int not null default 0
);

create table if not exists assets (
  id text primary key,
  register_no text not null unique,
  kib_code text not null,
  kib_group text not null,
  category text not null,
  topology text not null,
  name text not null,
  spec text,
  brand text,
  material text,
  year_acquired int,
  quantity int not null default 1,
  unit text not null default 'unit',
  unit_price numeric not null default 0,
  condition text not null default 'baik',
  room_id text references rooms(id) on delete set null,
  outdoor_site_id text references outdoor_sites(id) on delete set null,
  bidang_id text references bidangs(id) on delete set null,
  source_of_funds text,
  serial_no text,
  notes text,
  created_by text,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assets_topology_idx on assets (topology);
create index if not exists assets_category_idx on assets (category);
create index if not exists assets_room_idx on assets (room_id);
create index if not exists assets_site_idx on assets (outdoor_site_id);
create index if not exists assets_bidang_idx on assets (bidang_id);
create index if not exists assets_condition_idx on assets (condition);
create index if not exists rooms_bidang_idx on rooms (bidang_id);
create index if not exists sub_bidangs_bidang_idx on sub_bidangs (bidang_id);
create index if not exists staff_status_idx on staff_profiles (status);
