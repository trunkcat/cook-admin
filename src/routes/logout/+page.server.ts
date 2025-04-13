import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { routes, deleteSessionTokenCookie } from "$lib";
import { api } from "$lib/api";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) {
		return redirect(307, routes.login);
	}

	await api.extend({ fetch: event.fetch }).delete("manager/logout");
	deleteSessionTokenCookie(event);

	event.locals.session = null;

	return redirect(307, routes.login);
};
