import type { Actions, PageServerLoad } from "./$types";
import { superValidate, fail, message } from "sveltekit-superforms";
import { formSchema } from "./insert-place-form.svelte";
import { zod } from "sveltekit-superforms/adapters";
import { api } from "$lib/api";
import { error, redirect } from "@sveltejs/kit";
import { routes } from "$lib";

export const load: PageServerLoad = async (event) => {
	if (event.locals.session == null) {
		return redirect(307, routes.login);
	}

	const placeId = Number(event.params.placeId);
	if (event.params.placeId == null || isNaN(placeId)) {
		return error(404, "Place not found");
	}

	return {
		title: "Place Details",
		placeId: placeId,
		form: superValidate(zod(formSchema)),
	};
};

export const actions = {
	insert: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const res = await api
			.extend({ fetch: event.fetch })
			.post("manager/levels", { json: form.data });
		if (res.ok) {
			return message(form, { message: "Added place successfully" });
		} else {
			return error(500, { message: "Failed to add place" });
		}
	},
} satisfies Actions;
