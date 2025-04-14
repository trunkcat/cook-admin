import type { Actions, PageServerLoad } from "./$types";
import { superValidate, fail, message } from "sveltekit-superforms";
import { formSchema } from "./register-manager-form.svelte";
import { zod } from "sveltekit-superforms/adapters";
import { api } from "$lib/api";
import { error, redirect } from "@sveltejs/kit";
import { routes } from "$lib";

export const load: PageServerLoad = async (event) => {
	if (event.locals.session == null) {
		return redirect(307, routes.login);
	}

	return {
		title: "Managers",
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
			.post("manager/register", { json: form.data });

		if (res.ok) {
			return message(form, { message: "Added manager successfully" });
		} else {
			return error(500, { message: "Failed to add manager" });
		}
	},
} satisfies Actions;
