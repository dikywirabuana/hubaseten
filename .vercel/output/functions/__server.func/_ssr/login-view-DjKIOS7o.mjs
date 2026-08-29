import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-B30JdwGP.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-view-DjKIOS7o.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			accent: "bg-accent text-accent-foreground hover:opacity-90",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
			outline: "border border-border bg-card text-foreground hover:bg-muted",
			ghost: "text-foreground hover:bg-muted",
			sidebar: "text-sidebar-foreground hover:bg-sidebar-accent justify-start"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function BantenSeal({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/brand/lambang-banten.png",
		alt: "Lambang Provinsi Banten",
		className
	});
}
function DishubSeal({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/brand/lambang-perhubungan.png",
		alt: "Lambang Dinas Perhubungan",
		className
	});
}
function BrandLockup({ variant = "dark" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BantenSeal, { className: "size-11 shrink-0 object-contain" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishubSeal, { className: "size-11 shrink-0 object-contain" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg leading-none",
					children: "SIMASET"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `mt-1 text-[10px] tracking-[0.12em] uppercase ${variant === "dark" ? "text-sidebar-muted" : "text-muted-foreground"}`,
					children: "Dishub Provinsi Banten"
				})]
			})
		]
	});
}
function LoginView() {
	const google = GROK_PROVIDERS.find((p) => p.idp === "google");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden bg-sidebar text-sidebar-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 opacity-40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "h-full w-full",
				viewBox: "0 0 800 600",
				preserveAspectRatio: "none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 420 C180 360 240 500 400 440 S680 300 800 360 V600 H0 Z",
					fill: "currentColor",
					opacity: "0.25"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0 470 C200 410 320 520 500 460 S720 380 800 420 V600 H0 Z",
					fill: "currentColor",
					opacity: "0.35"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-sidebar-foreground/10 bg-sidebar-accent/50 p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BantenSeal, { className: "size-14 shrink-0 object-contain" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DishubSeal, { className: "size-14 shrink-0 object-contain" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl leading-none",
								children: "SIMASET"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs tracking-[0.16em] text-sidebar-muted uppercase",
								children: "Dinas Perhubungan Provinsi Banten"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-semibold",
						children: "Masuk inventaris aset"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-sidebar-muted",
						children: "Gunakan akun Google yang terdaftar. Administrator memverifikasi setiap akun sebelum membuka data ruangan, perlengkapan jalan, ATK, dan Kartu Inventaris Ruangan."
					}),
					google ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-8 h-12 w-full bg-paper text-ink hover:opacity-90",
						onClick: () => signIn(google.providerId, { callbackURL: "/" }),
						children: "Masuk dengan Google"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-sidebar-muted",
						children: "Masuk belum diaktifkan."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-xs text-sidebar-muted",
						children: "Pengguna pertama yang masuk otomatis menjadi administrator. Pengguna berikutnya menunggu persetujuan."
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginView as a, useCurrentUserState as c, DishubSeal as i, BrandLockup as n, cn as o, Button as r, useCurrentUser as s, BantenSeal as t };
