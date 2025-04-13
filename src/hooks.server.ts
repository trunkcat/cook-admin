import { deleteSessionTokenCookie, routes, SESSION_COOKIE_NAME, setSessionTokenCookie } from "$lib";
import { api } from "$lib/api";
import type { Result } from "$lib/types";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const route = event.url.pathname;
	console.log(event.request.method, route);

	const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);
	if (!sessionToken) {
		event.locals.session = null;
		if (route !== routes.login) {
			return redirect(303, routes.login);
		} else {
			return resolve(event);
		}
	}

	const response = await api.get("manager/session", {
		headers: { Authorization: "Bearer " + sessionToken },
	});
	if (!response.ok) {
		deleteSessionTokenCookie(event);
		return redirect(303, routes.login);
	}

	const session = await response.json<Result<NonNullable<App.Locals["session"]>>>();
	if (session == null || !session.ok) {
		deleteSessionTokenCookie(event);
		return redirect(303, routes.login);
	}
	setSessionTokenCookie(event, sessionToken, session.data.expiresAt);
	event.locals.session = session.data;
	event.locals.sessionToken = sessionToken;

	if (route === routes.logout) return resolve(event);

	if (route === routes.login) {
		switch (session.data.manager.role) {
			case "supermanager":
				return redirect(303, routes.supermanager);
			case "manager":
				return redirect(303, routes.manager);
			default:
				return redirect(303, routes.logout);
		}
	}

	// The role must meet the route.
	if (route.startsWith(routes.manager)) {
		if (event.locals.session.manager.role !== "manager") {
			return redirect(303, routes.manager);
		}
	} else {
		if (event.locals.session.manager.role !== "supermanager") {
			return redirect(303, routes.supermanager);
		}
	}

	return resolve(event);
};
