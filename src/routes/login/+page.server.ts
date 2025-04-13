import type { Actions, PageServerLoad } from "./$types";
import { superValidate, fail } from "sveltekit-superforms";
import { formSchema } from "./login-form.svelte";
import { zod } from "sveltekit-superforms/adapters";
import { api } from "$lib/api";
import { error, redirect } from "@sveltejs/kit";
import { routes, setSessionTokenCookie } from "$lib";
import type { Result } from "$lib/types";

export const load: PageServerLoad = async () => {
	return {
		form: superValidate(zod(formSchema)),
	};
};

export const actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await api.post("manager/login", {
			body: JSON.stringify(form.data),
			headers: { Authorization: "Bearer " + event.locals.sessionToken },
		});

		if (!response.ok) {
			return error(response.status, { message: "Something went wrong" });
		}
		const session = await response.json<Result<{ sessionToken: string; expiresAt: string }>>();
		if (session.ok) {
			setSessionTokenCookie(event, session.data.sessionToken, session.data.expiresAt);
			redirect(307, routes.supermanager);
		} else {
			return error(response.status, { message: "Something went wrong" });
		}
	},
} satisfies Actions;
