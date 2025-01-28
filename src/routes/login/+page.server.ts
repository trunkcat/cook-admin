import type { Actions, PageServerLoad } from "./$types";
import { superValidate, fail } from "sveltekit-superforms";
import { formSchema } from "./login-form.svelte";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema)),
	};
};

export const actions = {
	login: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		return { form };
	},
} satisfies Actions;
