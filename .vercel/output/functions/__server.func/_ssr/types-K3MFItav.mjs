import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/types-K3MFItav.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-B40BzJxt.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-BRnGXXNM.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var KIB_GROUPS = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"P"
];
var CATEGORY_LABEL = {
	perlengkapan_jalan: "Perlengkapan Jalan",
	jaringan: "Jaringan / PJU",
	gedung: "Gedung & Bangunan",
	kendaraan: "Kendaraan",
	alat_kantor: "Alat Kantor",
	atk: "ATK / Persediaan",
	jam: "Jam & Absensi"
};
var CONDITION_LABEL = {
	baik: "Baik",
	rusak_ringan: "Rusak Ringan",
	rusak_berat: "Rusak Berat",
	hilang: "Hilang"
};
var KIB_LABEL = {
	A: "KIB A · Tanah",
	B: "KIB B · Peralatan & Mesin",
	C: "KIB C · Gedung & Bangunan",
	D: "KIB D · Jalan, Irigasi & Jaringan",
	E: "KIB E · Aset Tetap Lainnya",
	F: "KIB F · Konstruksi Dalam Pengerjaan",
	P: "Persediaan"
};
var ROLE_LABEL = {
	admin: "Administrator",
	operator: "Operator Aset",
	viewer: "Pemirsa"
};
//#endregion
export { ROLE_LABEL as a, KIB_LABEL as i, CONDITION_LABEL as n, authMiddleware as o, KIB_GROUPS as r, CATEGORY_LABEL as t };
