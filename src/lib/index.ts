import type { RequestEvent } from "@sveltejs/kit";

export const SORT_DIR = ["unsorted", "ascending", "descending"] as const;

export const routes = {
	login: "/login",
	logout: "/logout",
	supermanager: "/super/places",
	manager: "/manager/events",
};

export const SESSION_COOKIE_NAME = "auth-session";

export function setSessionTokenCookie(
	event: RequestEvent,
	sessionToken: string,
	expiresAt: Date | string,
) {
	event.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
		expires: new Date(expiresAt),
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: import.meta.env.PROD ? "none" : "lax",
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(SESSION_COOKIE_NAME, {
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: import.meta.env.PROD ? "none" : "lax",
	});
}

export const priceFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});
