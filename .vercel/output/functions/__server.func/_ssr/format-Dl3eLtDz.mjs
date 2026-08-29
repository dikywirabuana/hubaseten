import { n as CONDITION_LABEL, t as CATEGORY_LABEL } from "./types-K3MFItav.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-Dl3eLtDz.js
function formatNumber(value) {
	return new Intl.NumberFormat("id-ID").format(Number.isFinite(value) ? value : 0);
}
function num(value) {
	if (value == null || value === "") return 0;
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}
function categoryLabel(c) {
	return CATEGORY_LABEL[c] ?? c;
}
function conditionLabel(c) {
	return CONDITION_LABEL[c] ?? c;
}
function displayAssetName(a) {
	const brand = a.brand?.trim();
	const name = a.name.trim();
	if (!brand) return name;
	if (name.toLowerCase().startsWith(brand.toLowerCase())) return name;
	return `${brand} ${name}`;
}
function siteTypeLabel(t) {
	return {
		ruas: "Ruas Jalan",
		simpang: "Simpang",
		terminal: "Terminal",
		pelabuhan: "Pelabuhan",
		halte: "Halte",
		area: "Area Operasional",
		pkb: "Pengujian Kendaraan"
	}[t] ?? t;
}
//#endregion
export { num as a, formatNumber as i, conditionLabel as n, siteTypeLabel as o, displayAssetName as r, categoryLabel as t };
