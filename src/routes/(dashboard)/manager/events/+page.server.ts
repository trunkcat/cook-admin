import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { routes } from "$lib";

export const load: PageServerLoad = async (event) => {
	if (event.locals.session == null) {
		return redirect(307, routes.login);
	}

	return { title: "Events" };
};
