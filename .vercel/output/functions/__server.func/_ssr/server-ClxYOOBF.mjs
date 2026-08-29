import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { o as authMiddleware } from "./types-K3MFItav.mjs";
import { a as num } from "./format-Dl3eLtDz.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string } from "../_libs/@better-auth/core+[...].mjs";
import { r as getSql } from "./db-CT3W-Jv4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-ClxYOOBF.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ForbiddenError = class extends Error {
	status = 403;
	constructor(message = "Forbidden") {
		super(message);
		this.name = "ForbiddenError";
	}
};
var categoryZ = _enum([
	"perlengkapan_jalan",
	"jaringan",
	"gedung",
	"kendaraan",
	"alat_kantor",
	"atk",
	"jam"
]);
var topologyZ = _enum(["indoor", "outdoor"]);
var conditionZ = _enum([
	"baik",
	"rusak_ringan",
	"rusak_berat",
	"hilang"
]);
var roleZ = _enum([
	"admin",
	"operator",
	"viewer"
]);
var statusZ = _enum([
	"pending",
	"approved",
	"rejected"
]);
function mapStaff(r) {
	return {
		userId: r.user_id,
		email: r.email,
		displayName: r.display_name,
		photoUrl: r.photo_url,
		role: r.role,
		status: r.status,
		bidangId: r.bidang_id,
		notes: r.notes,
		verifiedBy: r.verified_by,
		verifiedAt: r.verified_at,
		createdAt: r.created_at
	};
}
function mapAsset(r) {
	return {
		id: r.id,
		registerNo: r.register_no,
		kibCode: r.kib_code,
		kibGroup: r.kib_group,
		category: r.category,
		topology: r.topology,
		name: r.name,
		spec: r.spec,
		brand: r.brand,
		material: r.material,
		yearAcquired: r.year_acquired,
		quantity: Number(r.quantity) || 0,
		unit: r.unit,
		unitPrice: num(r.unit_price),
		condition: r.condition,
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
		updatedAt: r.updated_at
	};
}
var ASSET_SELECT = `
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
async function loadStaff(userId) {
	const rows = await (await getSql())`select * from staff_profiles where user_id = ${userId}`;
	return rows[0] ? mapStaff(rows[0]) : null;
}
async function requireApproved(userId) {
	const staff = await loadStaff(userId);
	if (!staff) throw new ForbiddenError("Profil belum terdaftar");
	if (staff.status === "pending") throw new ForbiddenError("Akun menunggu verifikasi admin");
	if (staff.status === "rejected") throw new ForbiddenError("Akses ditolak admin");
	if (staff.status !== "approved") throw new ForbiddenError();
	return staff;
}
async function requireAdmin(userId) {
	const staff = await requireApproved(userId);
	if (staff.role !== "admin") throw new ForbiddenError("Hanya administrator");
	return staff;
}
function canMutate(staff) {
	return staff.role === "admin" || staff.role === "operator";
}
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "1abc0461f8cbb28afdd9a46681b63247380c005a234d84423fc49c4a87666d1f",
	name: "getMyProfile",
	filename: "src/lib/simaset/server.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	email: string().nullable(),
	displayName: string().nullable(),
	photoUrl: string().nullable()
})).handler(getMyProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const existing = await loadStaff(context.userId);
	const email = data.email?.trim() || existing?.email || "unknown@local";
	const displayName = data.displayName ?? existing?.displayName ?? null;
	const photoUrl = data.photoUrl ?? existing?.photoUrl ?? null;
	if (!existing) {
		const isFirst = ((await sql`
        select count(*)::int as c from staff_profiles where role = 'admin' and status = 'approved'
      `)[0]?.c ?? 0) === 0;
		const role = isFirst ? "admin" : "operator";
		const status = isFirst ? "approved" : "pending";
		await sql`
        insert into staff_profiles (user_id, email, display_name, photo_url, role, status, verified_at)
        values (
          ${context.userId}, ${email}, ${displayName}, ${photoUrl}, ${role}, ${status},
          ${isFirst ? (/* @__PURE__ */ new Date()).toISOString() : null}
        )
      `;
		return await loadStaff(context.userId);
	}
	await sql`
      update staff_profiles
      set email = ${email},
          display_name = coalesce(${displayName}, display_name),
          photo_url = coalesce(${photoUrl}, photo_url),
          updated_at = now()
      where user_id = ${context.userId}
    `;
	return await loadStaff(context.userId);
});
var listStaff_createServerFn_handler = createServerRpc({
	id: "0d0ac571d669ea3ebbc5f047e612400aa7ff83cab1d132c7f48c9d14aef4b3d5",
	name: "listStaff",
	filename: "src/lib/simaset/server.ts"
}, (opts) => listStaff.__executeServer(opts));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listStaff_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	return (await (await getSql())`
      select * from staff_profiles order by
        case status when 'pending' then 0 when 'approved' then 1 else 2 end,
        created_at desc
    `).map(mapStaff);
});
var verifyStaff_createServerFn_handler = createServerRpc({
	id: "4c14a2c7e3f6842fa20ca7e94aeaaf78aed9a63591bb1c7ced5b983d4fccedb7",
	name: "verifyStaff",
	filename: "src/lib/simaset/server.ts"
}, (opts) => verifyStaff.__executeServer(opts));
var verifyStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	userId: string().min(1),
	status: statusZ,
	role: roleZ.optional()
})).handler(verifyStaff_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	if (data.userId === context.userId && data.status !== "approved") throw new ForbiddenError("Tidak dapat menonaktifkan akun sendiri");
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
var getDashboard_createServerFn_handler = createServerRpc({
	id: "61e5cdef06480bfd5aee0e6e460a943963e7533080caa90e5d17b9251ea0d366",
	name: "getDashboard",
	filename: "src/lib/simaset/server.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	await requireApproved(context.userId);
	const sql = await getSql();
	const [totals] = await sql`
      select count(*)::int as total,
             count(*) filter (where topology = 'indoor')::int as indoor,
             count(*) filter (where topology = 'outdoor')::int as outdoor,
             coalesce(sum(quantity * unit_price), 0) as value
      from assets
    `;
	const rooms = await sql`select count(*)::int as c from rooms`;
	const sites = await sql`select count(*)::int as c from outdoor_sites`;
	const pending = await sql`
      select count(*)::int as c from staff_profiles where status = 'pending'
    `;
	const byCategory = await sql`
      select category, count(*)::int as count, coalesce(sum(quantity * unit_price), 0) as value
      from assets group by category
    `;
	const byCondition = await sql`
      select condition, count(*)::int as count from assets group by condition
    `;
	const byBidang = await sql`
      select b.id, b.name, b.short_name,
             count(a.id)::int as count,
             coalesce(sum(a.quantity * a.unit_price), 0) as value
      from bidangs b
      left join assets a on a.bidang_id = b.id
      group by b.id, b.name, b.short_name, b.sort_order
      order by b.sort_order
    `;
	const bySite = await sql`
      select s.id, s.name, s.kabupaten,
             count(a.id)::int as count,
             coalesce(sum(a.quantity * a.unit_price), 0) as value
      from outdoor_sites s
      left join assets a on a.outdoor_site_id = s.id
      group by s.id, s.name, s.kabupaten, s.sort_order
      order by count desc
      limit 8
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
			value: num(r.value)
		})),
		byCondition: byCondition.map((r) => ({
			condition: r.condition,
			count: r.count
		})),
		byBidang: byBidang.map((r) => ({
			id: r.id,
			name: r.name,
			shortName: r.short_name,
			count: r.count,
			value: num(r.value)
		})),
		bySite: bySite.map((r) => ({
			id: r.id,
			name: r.name,
			kabupaten: r.kabupaten,
			count: r.count,
			value: num(r.value)
		}))
	};
});
var listBidangs_createServerFn_handler = createServerRpc({
	id: "26d2dda6ea60d3dbf2a17a1208deec506def0c14b924bf275424ebef1ae080d9",
	name: "listBidangs",
	filename: "src/lib/simaset/server.ts"
}, (opts) => listBidangs.__executeServer(opts));
var listBidangs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listBidangs_createServerFn_handler, async ({ context }) => {
	await requireApproved(context.userId);
	return (await (await getSql())`
      select b.*,
             (select count(*)::int from sub_bidangs s where s.bidang_id = b.id) as sub_count,
             (select count(*)::int from rooms r where r.bidang_id = b.id) as room_count,
             (select count(*)::int from assets a where a.bidang_id = b.id) as asset_count,
             (select coalesce(sum(a.quantity * a.unit_price), 0) from assets a where a.bidang_id = b.id) as asset_value
      from bidangs b
      order by b.sort_order
    `).map((r) => ({
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
		assetCount: r.asset_count,
		assetValue: num(r.asset_value)
	}));
});
var listSubBidangs_createServerFn_handler = createServerRpc({
	id: "ff32c26482d6ebbe0d6cdee95ceb7d08ad09ed2df62290b2e3b879db3e85fb8d",
	name: "listSubBidangs",
	filename: "src/lib/simaset/server.ts"
}, (opts) => listSubBidangs.__executeServer(opts));
var listSubBidangs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSubBidangs_createServerFn_handler, async ({ context }) => {
	await requireApproved(context.userId);
	return (await (await getSql())`select * from sub_bidangs order by sort_order, code`).map((s) => ({
		id: s.id,
		bidangId: s.bidang_id,
		code: s.code,
		name: s.name,
		headTitle: s.head_title,
		headName: s.head_name,
		headNip: s.head_nip,
		sortOrder: s.sort_order
	}));
});
var getBidang_createServerFn_handler = createServerRpc({
	id: "81c97e9e51d01b3aa65076214fa8b823c97ad541cfa2a58622ddf3368d869d0d",
	name: "getBidang",
	filename: "src/lib/simaset/server.ts"
}, (opts) => getBidang.__executeServer(opts));
var getBidang = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(getBidang_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const sql = await getSql();
	const r = (await sql`
      select b.*,
             (select count(*)::int from sub_bidangs s where s.bidang_id = b.id) as sub_count,
             (select count(*)::int from rooms r where r.bidang_id = b.id) as room_count,
             (select count(*)::int from assets a where a.bidang_id = b.id) as asset_count,
             (select coalesce(sum(a.quantity * a.unit_price), 0) from assets a where a.bidang_id = b.id) as asset_value
      from bidangs b
      where b.id = ${data.id}
    `)[0];
	if (!r) return null;
	const bidang = {
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
		assetCount: r.asset_count,
		assetValue: num(r.asset_value)
	};
	const subs = await sql`select * from sub_bidangs where bidang_id = ${data.id} order by sort_order`;
	const rooms = await loadRooms(data.id);
	return {
		bidang,
		subs: subs.map((s) => ({
			id: s.id,
			bidangId: s.bidang_id,
			code: s.code,
			name: s.name,
			headTitle: s.head_title,
			headName: s.head_name,
			headNip: s.head_nip,
			sortOrder: s.sort_order
		})),
		rooms
	};
});
function mapRoom(r) {
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
		assetValue: num(r.asset_value)
	};
}
async function loadRooms(bidangId) {
	const sql = await getSql();
	return (bidangId ? await sql`
        select r.id, r.bidang_id, b.name as bidang_name, r.sub_bidang_id, sb.name as sub_bidang_name,
               r.code, r.name, r.floor, r.building, r.pic_name, r.pic_nip, r.area_m2, r.sort_order,
               count(a.id)::int as asset_count,
               coalesce(sum(a.quantity * a.unit_price), 0) as asset_value
        from rooms r
        join bidangs b on b.id = r.bidang_id
        left join sub_bidangs sb on sb.id = r.sub_bidang_id
        left join assets a on a.room_id = r.id
        where r.bidang_id = ${bidangId}
        group by r.id, b.name, sb.name
        order by r.floor, r.sort_order
      ` : await sql`
        select r.id, r.bidang_id, b.name as bidang_name, r.sub_bidang_id, sb.name as sub_bidang_name,
               r.code, r.name, r.floor, r.building, r.pic_name, r.pic_nip, r.area_m2, r.sort_order,
               count(a.id)::int as asset_count,
               coalesce(sum(a.quantity * a.unit_price), 0) as asset_value
        from rooms r
        join bidangs b on b.id = r.bidang_id
        left join sub_bidangs sb on sb.id = r.sub_bidang_id
        left join assets a on a.room_id = r.id
        group by r.id, b.name, sb.name
        order by r.floor, b.sort_order, r.sort_order
      `).map(mapRoom);
}
var listRooms_createServerFn_handler = createServerRpc({
	id: "641b1d89eca76362ac60eb181bbd3c597809005b25e6a4460c47b6340f66df05",
	name: "listRooms",
	filename: "src/lib/simaset/server.ts"
}, (opts) => listRooms.__executeServer(opts));
var listRooms = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listRooms_createServerFn_handler, async ({ context }) => {
	await requireApproved(context.userId);
	return loadRooms();
});
var getRoom_createServerFn_handler = createServerRpc({
	id: "948cffe178a6ffb89ca4539ca297c9740fd08cec44d6af89e073e2b21e9dc8fb",
	name: "getRoom",
	filename: "src/lib/simaset/server.ts"
}, (opts) => getRoom.__executeServer(opts));
var getRoom = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(getRoom_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const room = (await loadRooms()).find((r) => r.id === data.id);
	if (!room) return null;
	return {
		room,
		assets: (await (await getSql()).query(`${ASSET_SELECT} where a.room_id = $1 order by a.kib_code, a.name`, [data.id])).map(mapAsset)
	};
});
var listSites_createServerFn_handler = createServerRpc({
	id: "fdf8e65b9728444e2f9082680f4a188263f9e729f99f48649d98ceae4db38f55",
	name: "listSites",
	filename: "src/lib/simaset/server.ts"
}, (opts) => listSites.__executeServer(opts));
var listSites = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSites_createServerFn_handler, async ({ context }) => {
	await requireApproved(context.userId);
	return (await (await getSql())`
      select s.*,
             count(a.id)::int as asset_count,
             coalesce(sum(a.quantity * a.unit_price), 0) as asset_value
      from outdoor_sites s
      left join assets a on a.outdoor_site_id = s.id
      group by s.id
      order by s.sort_order
    `).map((r) => ({
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
		assetValue: num(r.asset_value)
	}));
});
var getSite_createServerFn_handler = createServerRpc({
	id: "e99328cec062004a36304a44a61bd731a6667597e22f52b91a2ddb8c9fef3d3c",
	name: "getSite",
	filename: "src/lib/simaset/server.ts"
}, (opts) => getSite.__executeServer(opts));
var getSite = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: string() })).handler(getSite_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const sql = await getSql();
	const r = (await sql`
      select s.*,
             count(a.id)::int as asset_count,
             coalesce(sum(a.quantity * a.unit_price), 0) as asset_value
      from outdoor_sites s
      left join assets a on a.outdoor_site_id = s.id
      where s.id = ${data.id}
      group by s.id
    `)[0];
	if (!r) return null;
	return {
		site: {
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
			assetValue: num(r.asset_value)
		},
		assets: (await sql.query(`${ASSET_SELECT} where a.outdoor_site_id = $1 order by a.name`, [data.id])).map(mapAsset)
	};
});
var assetFilterZ = object({
	q: string().optional(),
	category: categoryZ.optional(),
	topology: topologyZ.optional(),
	condition: conditionZ.optional(),
	bidangId: string().optional(),
	roomId: string().optional(),
	siteId: string().optional(),
	kibGroup: string().optional(),
	limit: number().min(1).max(500).optional(),
	offset: number().min(0).optional()
});
var listAssets_createServerFn_handler = createServerRpc({
	id: "03ad926f079d3185a7283948d0338a54aefad8a85ae3e18170c212e3e40ec2b2",
	name: "listAssets",
	filename: "src/lib/simaset/server.ts"
}, (opts) => listAssets.__executeServer(opts));
var listAssets = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(assetFilterZ).handler(listAssets_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const sql = await getSql();
	const clauses = ["1=1"];
	const params = [];
	const add = (clause, value) => {
		params.push(value);
		clauses.push(clause.replace("?", `$${params.length}`));
	};
	if (data.q?.trim()) {
		const q = `%${data.q.trim().toLowerCase()}%`;
		params.push(q, q, q, q);
		const a = params.length - 3;
		clauses.push(`(lower(a.name) like $${a} or lower(a.register_no) like $${a + 1} or lower(coalesce(a.brand,'')) like $${a + 2} or lower(coalesce(a.spec,'')) like $${a + 3})`);
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
	const countRows = await sql.query(`select count(*)::int as c from assets a where ${where}`, params);
	return {
		items: (await sql.query(`${ASSET_SELECT} where ${where} order by a.year_acquired desc nulls last, a.name limit ${limit} offset ${offset}`, params)).map(mapAsset),
		total: countRows[0]?.c ?? 0
	};
});
var assetInputZ = object({
	registerNo: string().min(3),
	kibCode: string().min(1),
	kibGroup: string().min(1),
	category: categoryZ,
	topology: topologyZ,
	name: string().min(2),
	spec: string().nullable().optional(),
	brand: string().nullable().optional(),
	material: string().nullable().optional(),
	yearAcquired: number().int().min(1980).max(2100).nullable().optional(),
	quantity: number().int().min(0),
	unit: string().min(1),
	unitPrice: number().min(0).optional(),
	condition: conditionZ,
	roomId: string().nullable().optional(),
	outdoorSiteId: string().nullable().optional(),
	bidangId: string().nullable().optional(),
	sourceOfFunds: string().nullable().optional(),
	serialNo: string().nullable().optional(),
	notes: string().nullable().optional(),
	masterId: string().nullable().optional(),
	lat: number().nullable().optional(),
	lng: number().nullable().optional(),
	photo: string().nullable().optional()
});
function emptyToNull(v) {
	if (v == null) return null;
	const t = v.trim();
	return t.length ? t : null;
}
async function insertAsset(userId, data, id) {
	await (await getSql())`
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
var createAsset_createServerFn_handler = createServerRpc({
	id: "9ac86905ffe301773b43db06128f4ac8a23bb644358c7b4375ea142e6f6401fb",
	name: "createAsset",
	filename: "src/lib/simaset/server.ts"
}, (opts) => createAsset.__executeServer(opts));
var createAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(assetInputZ).handler(createAsset_createServerFn_handler, async ({ context, data }) => {
	if (!canMutate(await requireApproved(context.userId))) throw new ForbiddenError("Tidak berwenang menambah aset");
	const id = crypto.randomUUID();
	await insertAsset(context.userId, data, id);
	return { id };
});
var updateAsset_createServerFn_handler = createServerRpc({
	id: "fb8352c623eb2ca86946f635ea120be437edf713a3d0cbbf254bcc5656773e09",
	name: "updateAsset",
	filename: "src/lib/simaset/server.ts"
}, (opts) => updateAsset.__executeServer(opts));
var updateAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(assetInputZ.extend({ id: string().min(1) })).handler(updateAsset_createServerFn_handler, async ({ context, data }) => {
	if (!canMutate(await requireApproved(context.userId))) throw new ForbiddenError("Tidak berwenang mengubah aset");
	await (await getSql())`
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
var deleteAsset_createServerFn_handler = createServerRpc({
	id: "8040f9a1352f23ac0be30cead6f8709cab26ce574a3f3a9d415985744d62633c",
	name: "deleteAsset",
	filename: "src/lib/simaset/server.ts"
}, (opts) => deleteAsset.__executeServer(opts));
var deleteAsset = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(deleteAsset_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql())`delete from assets where id = ${data.id}`;
	return { ok: true };
});
function mapMaster(r) {
	return {
		id: r.id,
		code: r.code,
		name: r.name,
		brand: r.brand,
		spec: r.spec,
		category: r.category,
		kibGroup: r.kib_group,
		kibCode: r.kib_code,
		unit: r.unit,
		material: r.material,
		topology: r.topology,
		active: Boolean(r.active),
		sortOrder: r.sort_order
	};
}
var listMasters_createServerFn_handler = createServerRpc({
	id: "a5e926553cccbc1ba6a10d8bda173e6fe23cac6331fc97b78ff06b6eeddd7f83",
	name: "listMasters",
	filename: "src/lib/simaset/server.ts"
}, (opts) => listMasters.__executeServer(opts));
var listMasters = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMasters_createServerFn_handler, async ({ context }) => {
	await requireApproved(context.userId);
	return (await (await getSql())`
      select * from asset_masters order by sort_order, name
    `).map(mapMaster);
});
var masterInputZ = object({
	code: string().min(2),
	name: string().min(2),
	brand: string().nullable().optional(),
	spec: string().nullable().optional(),
	category: categoryZ,
	kibGroup: string().min(1),
	kibCode: string().min(1),
	unit: string().min(1),
	material: string().nullable().optional(),
	topology: topologyZ,
	active: boolean().optional()
});
var createMaster_createServerFn_handler = createServerRpc({
	id: "734700e4c312e93abdf52bd925da0ad1d4fd49f1f6469344ed1e5f560ae2b3d5",
	name: "createMaster",
	filename: "src/lib/simaset/server.ts"
}, (opts) => createMaster.__executeServer(opts));
var createMaster = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(masterInputZ).handler(createMaster_createServerFn_handler, async ({ context, data }) => {
	if (!canMutate(await requireApproved(context.userId))) throw new ForbiddenError("Tidak berwenang menambah master data");
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
var updateMaster_createServerFn_handler = createServerRpc({
	id: "5cddd8ec1c3f6b4a97b3d79dc28fad89bc5485c121e35a2053aa3208618bc3af",
	name: "updateMaster",
	filename: "src/lib/simaset/server.ts"
}, (opts) => updateMaster.__executeServer(opts));
var updateMaster = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(masterInputZ.extend({ id: string().min(1) })).handler(updateMaster_createServerFn_handler, async ({ context, data }) => {
	if (!canMutate(await requireApproved(context.userId))) throw new ForbiddenError("Tidak berwenang mengubah master data");
	await (await getSql())`
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
var deleteMaster_createServerFn_handler = createServerRpc({
	id: "74cb8185340db341820b2237039b83bdee4aa8c72dbdb36de36f86dd3315196f",
	name: "deleteMaster",
	filename: "src/lib/simaset/server.ts"
}, (opts) => deleteMaster.__executeServer(opts));
var deleteMaster = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: string().min(1) })).handler(deleteMaster_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await (await getSql())`delete from asset_masters where id = ${data.id}`;
	return { ok: true };
});
//#endregion
export { createAsset_createServerFn_handler, createMaster_createServerFn_handler, deleteAsset_createServerFn_handler, deleteMaster_createServerFn_handler, getBidang_createServerFn_handler, getDashboard_createServerFn_handler, getMyProfile_createServerFn_handler, getRoom_createServerFn_handler, getSite_createServerFn_handler, listAssets_createServerFn_handler, listBidangs_createServerFn_handler, listMasters_createServerFn_handler, listRooms_createServerFn_handler, listSites_createServerFn_handler, listStaff_createServerFn_handler, listSubBidangs_createServerFn_handler, updateAsset_createServerFn_handler, updateMaster_createServerFn_handler, verifyStaff_createServerFn_handler };
