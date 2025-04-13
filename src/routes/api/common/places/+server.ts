import { redirect } from "@sveltejs/kit";
import { api } from "$lib/api";
import { routes } from "$lib";

export async function GET({ locals }) {
	if (!locals.session) {
		return redirect(307, routes.login);
	}

	const response = await api.get("data/places");

	return Response.json({ ok: true, data: await response.json() });
}
