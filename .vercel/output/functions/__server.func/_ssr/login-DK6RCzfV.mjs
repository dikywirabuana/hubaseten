import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as LoginView, c as useCurrentUserState } from "./login-view-DjKIOS7o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DK6RCzfV.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-dvh place-items-center bg-sidebar text-sidebar-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl",
			children: "SIMASET"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-sidebar-muted",
			children: "Memuat sesi inventaris Dishub Banten…"
		})]
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginView, {});
}
//#endregion
export { Login as component };
