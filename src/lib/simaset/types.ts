export const ROLES = ["admin", "operator", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const STAFF_STATUSES = ["pending", "approved", "rejected"] as const;
export type StaffStatus = (typeof STAFF_STATUSES)[number];

export const CATEGORIES = [
  "perlengkapan_jalan",
  "jaringan",
  "gedung",
  "kendaraan",
  "alat_kantor",
  "atk",
  "jam",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const TOPOLOGIES = ["indoor", "outdoor"] as const;
export type Topology = (typeof TOPOLOGIES)[number];

export const CONDITIONS = ["baik", "rusak_ringan", "rusak_berat", "hilang"] as const;
export type Condition = (typeof CONDITIONS)[number];

export const KIB_GROUPS = ["A", "B", "C", "D", "E", "F", "P"] as const;
export type KibGroup = (typeof KIB_GROUPS)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  perlengkapan_jalan: "Perlengkapan Jalan",
  jaringan: "Jaringan / PJU",
  gedung: "Gedung & Bangunan",
  kendaraan: "Kendaraan",
  alat_kantor: "Alat Kantor",
  atk: "ATK / Persediaan",
  jam: "Jam & Absensi",
};

export const CONDITION_LABEL: Record<Condition, string> = {
  baik: "Baik",
  rusak_ringan: "Rusak Ringan",
  rusak_berat: "Rusak Berat",
  hilang: "Hilang",
};

export const KIB_LABEL: Record<KibGroup, string> = {
  A: "KIB A · Tanah",
  B: "KIB B · Peralatan & Mesin",
  C: "KIB C · Gedung & Bangunan",
  D: "KIB D · Jalan, Irigasi & Jaringan",
  E: "KIB E · Aset Tetap Lainnya",
  F: "KIB F · Konstruksi Dalam Pengerjaan",
  P: "Persediaan",
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  operator: "Operator Aset",
  viewer: "Pemirsa",
};

export type StaffProfile = {
  userId: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  role: Role;
  status: StaffStatus;
  bidangId: string | null;
  notes: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
};

export type Bidang = {
  id: string;
  code: string;
  name: string;
  shortName: string;
  kind: string;
  floor: string | null;
  description: string | null;
  sortOrder: number;
  headName: string | null;
  headNip: string | null;
  subCount: number;
  roomCount: number;
  siteCount: number;
  indoorCount: number;
  outdoorCount: number;
  assetCount: number;
  assetValue: number;
};

export type SubBidang = {
  id: string;
  bidangId: string;
  code: string;
  name: string;
  headTitle: string | null;
  headName: string | null;
  headNip: string | null;
  sortOrder: number;
};

export type Room = {
  id: string;
  bidangId: string;
  bidangName: string;
  subBidangId: string | null;
  subBidangName: string | null;
  code: string;
  name: string;
  floor: string;
  building: string;
  picName: string | null;
  picNip: string | null;
  areaM2: number | null;
  sortOrder: number;
  assetCount: number;
  assetValue: number;
};

export type OutdoorSite = {
  id: string;
  code: string;
  name: string;
  corridor: string | null;
  kabupaten: string | null;
  kmLabel: string | null;
  lat: number | null;
  lng: number | null;
  siteType: string;
  description: string | null;
  sortOrder: number;
  assetCount: number;
  assetValue: number;
};

export type AssetMaster = {
  id: string;
  code: string;
  name: string;
  brand: string | null;
  spec: string | null;
  category: Category;
  kibGroup: string;
  kibCode: string;
  unit: string;
  material: string | null;
  topology: Topology;
  active: boolean;
  sortOrder: number;
};

export type Asset = {
  id: string;
  registerNo: string;
  kibCode: string;
  kibGroup: string;
  category: Category;
  topology: Topology;
  name: string;
  spec: string | null;
  brand: string | null;
  material: string | null;
  yearAcquired: number | null;
  quantity: number;
  unit: string;
  unitPrice: number;
  condition: Condition;
  roomId: string | null;
  roomName: string | null;
  outdoorSiteId: string | null;
  outdoorSiteName: string | null;
  bidangId: string | null;
  bidangName: string | null;
  sourceOfFunds: string | null;
  serialNo: string | null;
  notes: string | null;
  masterId: string | null;
  lat: number | null;
  lng: number | null;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AssetInput = {
  registerNo: string;
  kibCode: string;
  kibGroup: string;
  category: Category;
  topology: Topology;
  name: string;
  spec?: string | null;
  brand?: string | null;
  material?: string | null;
  yearAcquired?: number | null;
  quantity: number;
  unit: string;
  unitPrice?: number;
  condition: Condition;
  roomId?: string | null;
  outdoorSiteId?: string | null;
  bidangId?: string | null;
  sourceOfFunds?: string | null;
  serialNo?: string | null;
  notes?: string | null;
  masterId?: string | null;
  lat?: number | null;
  lng?: number | null;
  photo?: string | null;
};

export type DashboardStats = {
  totalAssets: number;
  totalValue: number;
  indoorCount: number;
  outdoorCount: number;
  roomCount: number;
  siteCount: number;
  pendingStaff: number;
  byCategory: { category: Category; count: number; value: number }[];
  byCondition: { condition: Condition; count: number }[];
  byBidang: { id: string; name: string; shortName: string; count: number; value: number }[];
  bySite: { id: string; name: string; kabupaten: string | null; count: number; value: number }[];
  byKib: { kibGroup: string; count: number }[];
  byKabupaten: { kabupaten: string; siteCount: number; assetCount: number }[];
};

