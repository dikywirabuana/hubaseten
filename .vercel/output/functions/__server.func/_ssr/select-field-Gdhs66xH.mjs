import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as cn } from "./login-view-DjKIOS7o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/select-field-Gdhs66xH.js
var import_jsx_runtime = require_jsx_runtime();
function SelectField({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("flex h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		...props,
		children
	});
}
//#endregion
export { SelectField as t };
