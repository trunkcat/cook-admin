import type { Actions, PageServerLoad } from "./$types";
import { superValidate, fail } from "sveltekit-superforms";
import { formSchema } from "./insert-level-form.svelte";
import { zod } from "sveltekit-superforms/adapters";
import { api } from "$lib";

export const load: PageServerLoad = async () => {
    return {
        form: superValidate(zod(formSchema)),
    };
};

export const actions = {
    insert: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        await api.post("location_levels", { json: form.data });
        return { form };
    },
} satisfies Actions;