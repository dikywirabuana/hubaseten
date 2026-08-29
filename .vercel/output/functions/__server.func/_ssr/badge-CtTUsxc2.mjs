import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { o as cn } from "./login-view-DjKIOS7o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-CtTUsxc2.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-primary/10 text-primary",
		accent: "bg-accent/12 text-accent",
		muted: "bg-muted text-muted-foreground",
		good: "bg-good/12 text-good",
		warn: "bg-warn/12 text-warn",
		bad: "bg-bad/12 text-bad"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			variant,
			className
		})),
		...props
	});
}
//#endregion
export { Badge as t };
