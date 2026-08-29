import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { num } from "./format";
import type {
  Asset,
  AssetMaster,
  AssetInput,
  Bidang,
  Category,
  Condition,
  DashboardStats,
  OutdoorSite,
  Role,
  Room,
  StaffProfile,
  StaffStatus,
  SubBidang,
} from "./types";

class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

const categoryZ = z.enum([
  "perlengkapan_jalan",
  "jaringan",
  "gedung",
  "kendaraan",
  "alat_kantor",
  "atk",
  "jam",
]);
const topologyZ = z.enum(["indoor", "outdoor"]);
const conditionZ = z.enum(["baik", "rusak_ringan", "rusak_berat", "hilang"]);
const roleZ = z.enum(["admin", "operator", "viewer"]);
const statusZ = z.enum(["pending", "approved", "rejected"]);

type StaffRow = {
  user_id: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  role: string;
  status: string;
  bidang_id: string | null;
  notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
};

function mapStaff(r: StaffRow): StaffProfile {
  return {
    userId: r.user_id,
    email: r.email,
    displayName: r.display_name,
    photoUrl: r.photo_url,
    role: r.role as Role,
    status: r.status as StaffStatus,
    bidangId: r.bidang_id,
    notes: r.notes,
    verifiedBy: r.verified_by,
    verifiedAt: r.verified_at,
    createdAt: r.created_at,
  };
}

type AssetRow = {
  id: string;
  register_no: string;
  kib_code: string;
  kib_group: string;
  category: string;
  topology: string;
  name: string;
  spec: string | null;
  brand: string | null;
  material: string | null;
  year_acquired: number | null;
  quantity: number;
  unit: string;
  unit_price: string | number;
  condition: string;
  room_id: string | null;
  room_name: string | null;
  outdoor_site_id: string | null;
  outdoor_site_name: string | null;
  bidang_id: string | null;
  bidang_name: string | null;
  source_of_funds: string | null;
  serial_no: string | null;
  notes: string | null;
  master_id: string | null;
  lat: string | number | null;
  lng: string | number | null;
  photo: string | null;
  created_at: string;
  updated_at: string;
};

function mapAsset(r: AssetRow): Asset {
  return {
    id: r.id,
    registerNo: r.register_no,
    kibCode: r.kib_code,
    kibGroup: r.kib_group,
    category: r.category as Category,
    topology: r.topology as Asset["topology"],
    name: r.name,
    spec: r.spec,
    brand: r.brand,
    material: r.material,
    yearAcquired: r.year_acquired,
    quantity: Number(r.quantity) || 0,
    unit: r.unit,
    unitPrice: num(r.unit_price),
    condition: r.condition as Condition,
    roomId: r.room_id,
    roomName: r.room_name,
    outdoorSiteId: r.outdoor_site_id,
    outdoorSiteName: r.outdoor_site_name,
    bidangId: r.bidang_id,
    bidangName: r.bidang_name,
    sourceOfFunds: r.source_of_funds,
    serialNo: r.serial_no,
    notes: r.notes,
    masterId: r.master_id,
    lat: r.lat == null ? null : num(r.lat),
    lng: r.lng == null ? null : num(r.lng),
    photo: r.photo,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const ASSET_SELECT = `
  select a.id, a.register_no, a.kib_code, a.kib_group, a.category, a.topology,
         a.name, a.spec, a.brand, a.material, a.year_acquired, a.quantity, a.unit,
         a.unit_price, a.condition, a.room_id, r.name as room_name,
         a.outdoor_site_id, s.name as outdoor_site_name,
         a.bidang_id, b.name as bidang_name,
         a.source_of_funds, a.serial_no, a.notes,
         a.master_id, a.lat, a.lng, a.photo, a.created_at, a.updated_at
  from assets a
  left join rooms r on r.id = a.room_id
  left join outdoor_sites s on s.id = a.outdoor_site_id
  left join bidangs b on b.id = a.bidang_id
`;

async function loadStaff(userId: string): Promise<StaffProfile | null> {
  const sql = await getSql();
  const rows = await sql<StaffRow>`select * from staff_profiles where user_id = ${userId}`;
  return rows[0] ? mapStaff(rows[0]) : null;
}

async function requireApproved(userId: string): Promise<StaffProfile> {
  const staff = await loadStaff(userId);
  if (!staff) throw new ForbiddenError("Profil belum terdaftar");
  if (staff.status === "pending") throw new ForbiddenError("Akun menunggu verifikasi admin");
  if (staff.status === "rejected") throw new ForbiddenError("Akses ditolak admin");
  if (staff.status !== "approved") throw new ForbiddenError();
  return staff;
}

async function requireAdmin(userId: string): Promise<StaffProfile> {
  const staff = await requireApproved(userId);
  if (staff.role !== "admin") throw new ForbiddenError("Hanya administrator");
  return staff;
}

function canMutate(staff: StaffProfile): boolean {
  return staff.role === "admin" || staff.role === "operator";
}

export const getMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      email: z.string().nullable(),
      displayName: z.string().nullable(),
      photoUrl: z.string().nullable(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await loadStaff(context.userId);
    const email = data.email?.trim() || existing?.email || "unknown@local";
    const displayName = data.displayName ?? existing?.displayName ?? null;
    const photoUrl = data.photoUrl ?? existing?.photoUrl ?? null;

    if (!existing) {
      const admins = await sql<{ c: number }>`
        select count(*)::int as c from staff_profiles where role = 'admin' and status = 'approved'
      `;
      const isFirst = (admins[0]?.c ?? 0) === 0;
      const role = isFirst ? "admin" : "operator";
      const status = isFirst ? "approved" : "pending";
      await sql`
        insert into staff_profiles (user_id, email, display_name, photo_url, role, status, verified_at)
        values (
          ${context.userId}, ${email}, ${displayName}, ${photoUrl}, ${role}, ${status},
          ${isFirst ? new Date().toISOString() : null}
        )
      `;
      const created = await loadStaff(context.userId);
      return created!;
    }

    await sql`
      update staff_profiles
      set email = ${email},
          display_name = coalesce(${displayName}, display_name),
          photo_url = coalesce(${photoUrl}, photo_url),
          updated_at = now()
      where user_id = ${context.userId}
    `;
    return (await loadStaff(context.userId))!;
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    const rows = await sql<StaffRow>`
      select * from staff_profiles order by
        case status when 'pending' then 0 when 'approved' then 1 else 2 end,
        created_at desc
    `;
    return rows.map(mapStaff);
  });

export const verifyStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      userId: z.string().min(1),
      status: statusZ,
      role: roleZ.optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    if (data.userId === context.userId && data.status !== "approved") {
      throw new ForbiddenError("Tidak dapat menonaktifkan akun sendiri");
    }
    const sql = await getSql();
    const role = data.role ?? "operator";
    await sql`
      update staff_profiles
      set status = ${data.status},
          role = ${role},
          verified_by = ${context.userId},
          verified_at = now(),
          updated_at = now()
      where user_id = ${data.userId}
    `;
    return { ok: true };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<DashboardStats> => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const [totals] = await sql<{
      total: number;
      indoor: number;
      outdoor: number;
      value: string | number;
    }>`
      select count(*)::int as total,
             count(*) filter (where topology = 'indoor')::int as indoor,
             count(*) filter (where topology = 'outdoor')::int as outdoor,
             coalesce(sum(quantity * unit_price), 0) as value
      from assets
    `;
    const rooms = await sql<{ c: number }>`select count(*)::int as c from rooms`;
    const sites = await sql<{ c: number }>`select count(*)::int as c from outdoor_sites`;
    const pending = await sql<{ c: number }>`
      select count(*)::int as c from staff_profiles where status = 'pending'
    `;
    const byCategory = await sql<{ category: Category; count: number; value: string | number }>`
      select category, count(*)::int as count, coalesce(sum(quantity * unit_price), 0) as value
      from assets group by category
    `;
    const byCondition = await sql<{ condition: Condition; count: number }>`
      select condition, count(*)::int as count from assets group by condition
    `;
    const byBidang = await sql<{
      id: string;
      name: string;
      short_name: string;
      count: number;
      value: string | number;
    }>`
      select b.id, b.name, b.short_name,
             count(a.id)::int as count,
             coalesce(sum(a.quantity * a.unit_price), 0) as value
      from bidangs b
      left join assets a on a.bidang_id = b.id
      group by b.id, b.name, b.short_name, b.sort_order
      order by b.sort_order
    `;
    const bySite = await sql<{
      id: string;
      name: string;
      kabupaten: string | null;
      count: number;
      value: string | number;
    }>`
      select s.id, s.name, s.kabupaten,
             count(a.id)::int as count,
             coalesce(sum(a.quantity * a.unit_price), 0) as value
      from outdoor_sites s
      left join assets a on a.outdoor_site_id = s.id
      group by s.id, s.name, s.kabupaten, s.sort_order
      order by count desc
      limit 8
    `;
    const byKib = await sql<{ kib_group: string; count: number }>`
      select kib_group, count(*)::int as count
      from assets
      group by kib_group
      order by kib_group
    `;
    const byKabupaten = await sql<{
      kabupaten: string;
      site_count: number;
      asset_count: number;
    }>`
      select coalesce(nullif(s.kabupaten, ''), 'Lainnya') as kabupaten,
             count(distinct s.id)::int as site_count,
             count(a.id)::int as asset_count
      from outdoor_sites s
      left join assets a on a.outdoor_site_id = s.id
      group by 1
      order by asset_count desc
    `;
    return {
      totalAssets: totals?.total ?? 0,
      totalValue: num(totals?.value),
      indoorCount: totals?.indoor ?? 0,
      outdoorCount: totals?.outdoor ?? 0,
      roomCount: rooms[0]?.c ?? 0,
      siteCount: sites[0]?.c ?? 0,
      pendingStaff: pending[0]?.c ?? 0,
      byCategory: byCategory.map((r) => ({
        category: r.category,
        count: r.count,
        value: num(r.value),
      })),
      byCondition: byCondition.map((r) => ({ condition: r.condition, count: r.count })),
      byBidang: byBidang.map((r) => ({
        id: r.id,
        name: r.name,
        shortName: r.short_name,
        count: r.count,
        value: num(r.value),
      })),
      bySite: bySite.map((r) => ({
        id: r.id,
        name: r.name,
        kabupaten: r.kabupaten,
        count: r.count,
        value: num(r.value),
      })),
      byKib: byKib.map((r) => ({ kibGroup: r.kib_group, count: r.count })),
      byKabupaten: byKabupaten.map((r) => ({
        kabupaten: r.kabupaten,
        siteCount: r.site_count,
        assetCount: r.asset_count,
      })),
    };
  });

export const listBidangs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Bidang[]> => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const rows = await sql<BidangRow>`
      select b.*,
             (select count(*)::int from sub_bidangs s where s.bidang_id = b.id) as sub_count,
             (select count(*)::int from rooms r where r.bidang_id = b.id) as room_count,
             (select count(*)::int from assets a where a.bidang_id = b.id) as asset_count,
             (select coalesce(sum(a.quantity * a.unit_price), 0) from assets a where a.bidang_id = b.id) as asset_value,
             (select count(*)::int from assets a where a.bidang_id = b.id and a.topology = 'indoor') as indoor_count,
             (select count(*)::int from assets a where a.bidang_id = b.id and a.topology = 'outdoor') as outdoor_count,
             (select count(distinct a.outdoor_site_id)::int from assets a where a.bidang_id = b.id and a.outdoor_site_id is not null) as site_count
      from bidangs b
      order by b.sort_order
    `;
    return rows.map((r) => mapBidangRow(r));
  });

export const listSubBidangs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SubBidang[]> => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      bidang_id: string;
      code: string;
      name: string;
      head_title: string | null;
      head_name: string | null;
      head_nip: string | null;
      sort_order: number;
    }>`select * from sub_bidangs order by sort_order, code`;
    return rows.map((s) => ({
      id: s.id,
      bidangId: s.bidang_id,
      code: s.code,
      name: s.name,
      headTitle: s.head_title,
      headName: s.head_name,
      headNip: s.head_nip,
      sortOrder: s.sort_order,
    }));
  });

export const getBidang = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const rows = await sql<BidangRow>`
      select b.*,
             (select count(*)::int from sub_bidangs s where s.bidang_id = b.id) as sub_count,
             (select count(*)::int from rooms r where r.bidang_id = b.id) as room_count,
             (select count(*)::int from assets a where a.bidang_id = b.id) as asset_count,
             (select coalesce(sum(a.quantity * a.unit_price), 0) from assets a where a.bidang_id = b.id) as asset_value,
             (select count(*)::int from assets a where a.bidang_id = b.id and a.topology = 'indoor') as indoor_count,
             (select count(*)::int from assets a where a.bidang_id = b.id and a.topology = 'outdoor') as outdoor_count,
             (select count(distinct a.outdoor_site_id)::int from assets a where a.bidang_id = b.id and a.outdoor_site_id is not null) as site_count
      from bidangs b
      where b.id = ${data.id}
    `;
    const r = rows[0];
    if (!r) return null;
    const bidang = mapBidangRow(r);
    const subs = await sql<{
      id: string;
      bidang_id: string;
      code: string;
      name: string;
      head_title: string | null;
      head_name: string | null;
      head_nip: string | null;
      sort_order: number;
    }>`select * from sub_bidangs where bidang_id = ${data.id} order by sort_order`;
    const rooms = await loadRooms(data.id);
    const sites = await loadSitesForBidang(data.id);
    return {
      bidang,
      subs: subs.map(
        (s): SubBidang => ({
          id: s.id,
          bidangId: s.bidang_id,
          code: s.code,
          name: s.name,
          headTitle: s.head_title,
          headName: s.head_name,
          headNip: s.head_nip,
          sortOrder: s.sort_order,
        }),
      ),
      rooms,
      sites,
    };
  });

type RoomRow = {
  id: string;
  bidang_id: string;
  bidang_name: string;
  sub_bidang_id: string | null;
  sub_bidang_name: string | null;
  code: string;
  name: string;
  floor: string;
  building: string;
  pic_name: string | null;
  pic_nip: string | null;
  area_m2: string | number | null;
  sort_order: number;
  asset_count: number;
  asset_value: string | number;
};

function mapRoom(r: RoomRow): Room {
  return {
    id: r.id,
    bidangId: r.bidang_id,
    bidangName: r.bidang_name,
    subBidangId: r.sub_bidang_id,
    subBidangName: r.sub_bidang_name,
    code: r.code,
    name: r.name,
    floor: r.floor,
    building: r.building,
    picName: r.pic_name,
    picNip: r.pic_nip,
    areaM2: r.area_m2 == null ? null : num(r.area_m2),
    sortOrder: r.sort_order,
    assetCount: r.asset_count,
    assetValue: num(r.asset_value),
  };
}

async function loadRooms(bidangId?: string): Promise<Room[]> {
  const sql = await getSql();
  const rows = bidangId
    ? await sql<Omit<RoomRow, "asset_count" | "asset_value">>`
        select r.id, r.bidang_id, b.name as bidang_name, r.sub_bidang_id, sb.name as sub_bidang_name,
               r.code, r.name, r.floor, r.building, r.pic_name, r.pic_nip, r.area_m2, r.sort_order
        from rooms r
        join bidangs b on b.id = r.bidang_id
        left join sub_bidangs sb on sb.id = r.sub_bidang_id
        where r.bidang_id = ${bidangId}
        order by r.floor, r.sort_order
      `
    : await sql<Omit<RoomRow, "asset_count" | "asset_value">>`
        select r.id, r.bidang_id, b.name as bidang_name, r.sub_bidang_id, sb.name as sub_bidang_name,
               r.code, r.name, r.floor, r.building, r.pic_name, r.pic_nip, r.area_m2, r.sort_order
        from rooms r
        join bidangs b on b.id = r.bidang_id
        left join sub_bidangs sb on sb.id = r.sub_bidang_id
        order by b.sort_order, r.floor, r.sort_order
      `;
  const counts = new Map<string, { n: number; v: number }>();
  try {
    const stats = await sql<{ room_id: string; n: number; v: string | number }>`
      select room_id, count(*)::int as n, coalesce(sum(quantity * unit_price), 0) as v
      from assets
      where room_id is not null
      group by room_id
    `;
    for (const s of stats) counts.set(s.room_id, { n: s.n, v: num(s.v) });
  } catch {
    /* daftar ruangan tetap tampil meski hitungan aset gagal */
  }
  return rows.map((r) => {
    const c = counts.get(r.id);
    return mapRoom({ ...r, asset_count: c?.n ?? 0, asset_value: c?.v ?? 0 });
  });
}

type SiteRow = {
  id: string;
  code: string;
  name: string;
  corridor: string | null;
  kabupaten: string | null;
  km_label: string | null;
  lat: string | number | null;
  lng: string | number | null;
  site_type: string;
  description: string | null;
  sort_order: number;
  asset_count: number;
  asset_value: string | number;
};

function mapSite(r: SiteRow): OutdoorSite {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    corridor: r.corridor,
    kabupaten: r.kabupaten,
    kmLabel: r.km_label,
    lat: r.lat == null ? null : num(r.lat),
    lng: r.lng == null ? null : num(r.lng),
    siteType: r.site_type,
    description: r.description,
    sortOrder: r.sort_order,
    assetCount: r.asset_count,
    assetValue: num(r.asset_value),
  };
}

async function loadSitesForBidang(bidangId: string): Promise<OutdoorSite[]> {
  const sql = await getSql();
  const rows = await sql<SiteRow>`
    select s.id, s.code, s.name, s.corridor, s.kabupaten, s.km_label,
           coalesce(avg(a.lat) filter (where a.lat is not null), s.lat) as lat,
           coalesce(avg(a.lng) filter (where a.lng is not null), s.lng) as lng,
           s.site_type, s.description, s.sort_order,
           count(a.id)::int as asset_count,
           coalesce(sum(a.quantity * a.unit_price), 0) as asset_value
    from outdoor_sites s
    join assets a on a.outdoor_site_id = s.id
    where a.bidang_id = ${bidangId}
    group by s.id
    order by count(a.id) desc, s.name
  `;
  return rows.map(mapSite);
}

export const listRooms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireApproved(context.userId);
    return loadRooms();
  });

export const getRoom = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const rooms = await loadRooms();
    const room = rooms.find((r) => r.id === data.id);
    if (!room) return null;
    const sql = await getSql();
    const rows = await sql.query<AssetRow>(
      `${ASSET_SELECT} where a.room_id = $1 order by a.kib_code, a.name`,
      [data.id],
    );
    return { room, assets: rows.map(mapAsset) };
  });

export const listSites = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OutdoorSite[]> => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      code: string;
      name: string;
      corridor: string | null;
      kabupaten: string | null;
      km_label: string | null;
      lat: string | number | null;
      lng: string | number | null;
      site_type: string;
      description: string | null;
      sort_order: number;
      asset_count: number;
      asset_value: string | number;
    }>`
      select s.id, s.code, s.name, s.corridor, s.kabupaten, s.km_label,
             coalesce(avg(a.lat) filter (where a.lat is not null), s.lat) as lat,
             coalesce(avg(a.lng) filter (where a.lng is not null), s.lng) as lng,
             s.site_type, s.description, s.sort_order,
             count(a.id)::int as asset_count,
             coalesce(sum(a.quantity * a.unit_price), 0) as asset_value
      from outdoor_sites s
      left join assets a on a.outdoor_site_id = s.id
      group by s.id
      order by s.sort_order
    `;
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      corridor: r.corridor,
      kabupaten: r.kabupaten,
      kmLabel: r.km_label,
      lat: r.lat == null ? null : num(r.lat),
      lng: r.lng == null ? null : num(r.lng),
      siteType: r.site_type,
      description: r.description,
      sortOrder: r.sort_order,
      assetCount: r.asset_count,
      assetValue: num(r.asset_value),
    }));
  });

export const getSite = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const allSites = await sql<{
      id: string;
      code: string;
      name: string;
      corridor: string | null;
      kabupaten: string | null;
      km_label: string | null;
      lat: string | number | null;
      lng: string | number | null;
      site_type: string;
      description: string | null;
      sort_order: number;
      asset_count: number;
      asset_value: string | number;
    }>`
      select s.*,
             count(a.id)::int as asset_count,
             coalesce(sum(a.quantity * a.unit_price), 0) as asset_value
      from outdoor_sites s
      left join assets a on a.outdoor_site_id = s.id
      where s.id = ${data.id}
      group by s.id
    `;
    const r = allSites[0];
    if (!r) return null;
    const site: OutdoorSite = {
      id: r.id,
      code: r.code,
      name: r.name,
      corridor: r.corridor,
      kabupaten: r.kabupaten,
      kmLabel: r.km_label,
      lat: r.lat == null ? null : num(r.lat),
      lng: r.lng == null ? null : num(r.lng),
      siteType: r.site_type,
      description: r.description,
      sortOrder: r.sort_order,
      assetCount: r.asset_count,
      assetValue: num(r.asset_value),
    };
    const rows = await sql.query<AssetRow>(
      `${ASSET_SELECT} where a.outdoor_site_id = $1 order by a.name`,
      [data.id],
    );
    return { site, assets: rows.map(mapAsset) };
  });

const assetFilterZ = z.object({
  q: z.string().optional(),
  category: categoryZ.optional(),
  topology: topologyZ.optional(),
  condition: conditionZ.optional(),
  bidangId: z.string().optional(),
  roomId: z.string().optional(),
  siteId: z.string().optional(),
  kibGroup: z.string().optional(),
  limit: z.number().min(1).max(500).optional(),
  offset: z.number().min(0).optional(),
});

export const listAssets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(assetFilterZ)
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const clauses: string[] = ["1=1"];
    const params: unknown[] = [];
    const add = (clause: string, value: unknown) => {
      params.push(value);
      clauses.push(clause.replace("?", `$${params.length}`));
    };
    if (data.q?.trim()) {
      const q = `%${data.q.trim().toLowerCase()}%`;
      params.push(q, q, q, q);
      const a = params.length - 3;
      clauses.push(
        `(lower(a.name) like $${a} or lower(a.register_no) like $${a + 1} or lower(coalesce(a.brand,'')) like $${a + 2} or lower(coalesce(a.spec,'')) like $${a + 3})`,
      );
    }
    if (data.category) add("a.category = ?", data.category);
    if (data.topology) add("a.topology = ?", data.topology);
    if (data.condition) add("a.condition = ?", data.condition);
    if (data.bidangId) add("a.bidang_id = ?", data.bidangId);
    if (data.roomId) add("a.room_id = ?", data.roomId);
    if (data.siteId) add("a.outdoor_site_id = ?", data.siteId);
    if (data.kibGroup) add("a.kib_group = ?", data.kibGroup);
    const where = clauses.join(" and ");
    const limit = data.limit ?? 120;
    const offset = data.offset ?? 0;
    const countRows = await sql.query<{ c: number }>(
      `select count(*)::int as c from assets a where ${where}`,
      params,
    );
    const rows = await sql.query<AssetRow>(
      `${ASSET_SELECT} where ${where} order by a.year_acquired desc nulls last, a.name limit ${limit} offset ${offset}`,
      params,
    );
    return { items: rows.map(mapAsset), total: countRows[0]?.c ?? 0 };
  });

const assetInputZ = z.object({
  registerNo: z.string().min(3),
  kibCode: z.string().min(1),
  kibGroup: z.string().min(1),
  category: categoryZ,
  topology: topologyZ,
  name: z.string().min(2),
  spec: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  yearAcquired: z.number().int().min(1980).max(2100).nullable().optional(),
  quantity: z.number().int().min(0),
  unit: z.string().min(1),
  unitPrice: z.number().min(0).optional(),
  condition: conditionZ,
  roomId: z.string().nullable().optional(),
  outdoorSiteId: z.string().nullable().optional(),
  bidangId: z.string().nullable().optional(),
  sourceOfFunds: z.string().nullable().optional(),
  serialNo: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  masterId: z.string().nullable().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  photo: z.string().nullable().optional(),
});

function emptyToNull(v: string | null | undefined): string | null {
  if (v == null) return null;
  const t = v.trim();
  return t.length ? t : null;
}

type BidangRow = {
  id: string;
  code: string;
  name: string;
  short_name: string;
  kind: string;
  floor: string | null;
  description: string | null;
  sort_order: number;
  head_name: string | null;
  head_nip: string | null;
  sub_count: number;
  room_count: number;
  asset_count: number;
  asset_value: string | number;
  indoor_count: number;
  outdoor_count: number;
  site_count: number;
};

function mapBidangRow(r: BidangRow): Bidang {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    shortName: r.short_name,
    kind: r.kind,
    floor: r.floor,
    description: r.description,
    sortOrder: r.sort_order,
    headName: r.head_name,
    headNip: r.head_nip,
    subCount: r.sub_count,
    roomCount: r.room_count,
    siteCount: r.site_count,
    indoorCount: r.indoor_count,
    outdoorCount: r.outdoor_count,
    assetCount: r.asset_count,
    assetValue: num(r.asset_value),
  };
}

async function insertAsset(userId: string, data: AssetInput, id: string) {
  const sql = await getSql();
  await sql`
    insert into assets (
      id, register_no, kib_code, kib_group, category, topology, name, spec, brand, material,
      year_acquired, quantity, unit, unit_price, condition, room_id, outdoor_site_id, bidang_id,
      source_of_funds, serial_no, notes, master_id, lat, lng, photo, created_by, updated_by
    ) values (
      ${id}, ${data.registerNo.trim()}, ${data.kibCode.trim()}, ${data.kibGroup},
      ${data.category}, ${data.topology}, ${data.name.trim()},
      ${emptyToNull(data.spec)}, ${emptyToNull(data.brand)}, ${emptyToNull(data.material)},
      ${data.yearAcquired ?? null}, ${data.quantity}, ${data.unit}, ${data.unitPrice ?? 0},
      ${data.condition}, ${emptyToNull(data.roomId)}, ${emptyToNull(data.outdoorSiteId)},
      ${emptyToNull(data.bidangId)}, ${emptyToNull(data.sourceOfFunds)}, ${emptyToNull(data.serialNo)},
      ${emptyToNull(data.notes)}, ${emptyToNull(data.masterId)}, ${data.lat ?? null}, ${data.lng ?? null},
      ${emptyToNull(data.photo)}, ${userId}, ${userId}
    )
  `;
}

export const createAsset = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(assetInputZ)
  .handler(async ({ context, data }) => {
    const staff = await requireApproved(context.userId);
    if (!canMutate(staff)) throw new ForbiddenError("Tidak berwenang menambah aset");
    const id = crypto.randomUUID();
    await insertAsset(context.userId, data, id);
    return { id };
  });

export const updateAsset = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(assetInputZ.extend({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const staff = await requireApproved(context.userId);
    if (!canMutate(staff)) throw new ForbiddenError("Tidak berwenang mengubah aset");
    const sql = await getSql();
    await sql`
      update assets set
        register_no = ${data.registerNo.trim()},
        kib_code = ${data.kibCode.trim()},
        kib_group = ${data.kibGroup},
        category = ${data.category},
        topology = ${data.topology},
        name = ${data.name.trim()},
        spec = ${emptyToNull(data.spec)},
        brand = ${emptyToNull(data.brand)},
        material = ${emptyToNull(data.material)},
        year_acquired = ${data.yearAcquired ?? null},
        quantity = ${data.quantity},
        unit = ${data.unit},
        condition = ${data.condition},
        room_id = ${emptyToNull(data.roomId)},
        outdoor_site_id = ${emptyToNull(data.outdoorSiteId)},
        bidang_id = ${emptyToNull(data.bidangId)},
        source_of_funds = ${emptyToNull(data.sourceOfFunds)},
        serial_no = ${emptyToNull(data.serialNo)},
        notes = ${emptyToNull(data.notes)},
        master_id = ${emptyToNull(data.masterId)},
        lat = ${data.lat ?? null},
        lng = ${data.lng ?? null},
        photo = ${emptyToNull(data.photo)},
        updated_by = ${context.userId},
        updated_at = now()
      where id = ${data.id}
    `;
    return { ok: true };
  });

export const deleteAsset = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const staff = await requireAdmin(context.userId);
    void staff;
    const sql = await getSql();
    await sql`delete from assets where id = ${data.id}`;
    return { ok: true };
  });

type MasterRow = {
  id: string;
  code: string;
  name: string;
  brand: string | null;
  spec: string | null;
  category: string;
  kib_group: string;
  kib_code: string;
  unit: string;
  material: string | null;
  topology: string;
  active: boolean;
  sort_order: number;
};

function mapMaster(r: MasterRow): AssetMaster {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    brand: r.brand,
    spec: r.spec,
    category: r.category as Category,
    kibGroup: r.kib_group,
    kibCode: r.kib_code,
    unit: r.unit,
    material: r.material,
    topology: r.topology as Asset["topology"],
    active: Boolean(r.active),
    sortOrder: r.sort_order,
  };
}

export const listMasters = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AssetMaster[]> => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const rows = await sql<MasterRow>`
      select * from asset_masters order by sort_order, name
    `;
    return rows.map(mapMaster);
  });

const masterInputZ = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  brand: z.string().nullable().optional(),
  spec: z.string().nullable().optional(),
  category: categoryZ,
  kibGroup: z.string().min(1),
  kibCode: z.string().min(1),
  unit: z.string().min(1),
  material: z.string().nullable().optional(),
  topology: topologyZ,
  active: z.boolean().optional(),
});

export const createMaster = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(masterInputZ)
  .handler(async ({ context, data }) => {
    const staff = await requireApproved(context.userId);
    if (!canMutate(staff)) throw new ForbiddenError("Tidak berwenang menambah master data");
    const sql = await getSql();
    const id = `m-${crypto.randomUUID().slice(0, 8)}`;
    await sql`
      insert into asset_masters (
        id, code, name, brand, spec, category, kib_group, kib_code, unit, material, topology, active, sort_order
      ) values (
        ${id}, ${data.code.trim()}, ${data.name.trim()}, ${emptyToNull(data.brand)}, ${emptyToNull(data.spec)},
        ${data.category}, ${data.kibGroup}, ${data.kibCode.trim()}, ${data.unit.trim()},
        ${emptyToNull(data.material)}, ${data.topology}, ${data.active ?? true}, 100
      )
    `;
    return { id };
  });

export const updateMaster = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(masterInputZ.extend({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const staff = await requireApproved(context.userId);
    if (!canMutate(staff)) throw new ForbiddenError("Tidak berwenang mengubah master data");
    const sql = await getSql();
    await sql`
      update asset_masters set
        code = ${data.code.trim()},
        name = ${data.name.trim()},
        brand = ${emptyToNull(data.brand)},
        spec = ${emptyToNull(data.spec)},
        category = ${data.category},
        kib_group = ${data.kibGroup},
        kib_code = ${data.kibCode.trim()},
        unit = ${data.unit.trim()},
        material = ${emptyToNull(data.material)},
        topology = ${data.topology},
        active = ${data.active ?? true}
      where id = ${data.id}
    `;
    return { ok: true };
  });

export const deleteMaster = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);
    const sql = await getSql();
    await sql`delete from asset_masters where id = ${data.id}`;
    return { ok: true };
  });
