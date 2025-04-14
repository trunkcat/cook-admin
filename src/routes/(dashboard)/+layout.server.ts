import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { routes } from "$lib";
import { SIDEBAR_COOKIE_NAME } from "$lib/components/ui/sidebar/constants";

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	if (locals.session == null) {
		return redirect(307, routes.login);
	}

	const sidebarOpen = cookies.get(SIDEBAR_COOKIE_NAME);

	return {
		sidebarOpen: sidebarOpen === "true",
		username: locals.session.manager.username,
		role: locals.session.manager.role,
	};
};
