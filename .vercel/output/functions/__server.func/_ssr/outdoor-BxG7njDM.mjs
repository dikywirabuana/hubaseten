import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as listSites, n as Skeleton, t as Page } from "./skeleton-CtyHf9Ij.mjs";
import { t as OutdoorMap } from "./outdoor-map-BN-R0SqL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/outdoor-BxG7njDM.js
var import_jsx_runtime = require_jsx_runtime();
function OutdoorPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, { children: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutdoorBody, {}) });
}
function OutdoorBody() {
	const q = useQuery({
		queryKey: ["sites"],
		queryFn: () => listSites()
	});
	if (q.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.18em] text-muted-foreground uppercase",
				children: "Topologi outdoor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-3xl font-semibold",
				children: "Perlengkapan jalan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted-foreground",
				children: "Aset di luar kantor. Klik titik di peta untuk membuka Google Street View agar rambu, APILL, PJU, dan perlengkapan jalan terlihat dari jalan."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutdoorMap, { sites: q.data ?? [] })]
	});
}
//#endregion
export { OutdoorPage as component };
