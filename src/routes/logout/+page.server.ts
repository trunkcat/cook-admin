import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { routes, deleteSessionTokenCookie } from "$lib";
import { api } from "$lib/api";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) {
		return redirect(307, routes.login);
	}

	await api.delete("manager/logout", {
		headers: { Authorization: "Bearer " + event.locals.sessionToken },
	});
	deleteSessionTokenCookie(event);

	event.locals.session = null;

	return redirect(307, routes.login);
};
