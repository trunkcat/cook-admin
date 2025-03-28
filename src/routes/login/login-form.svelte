<script lang="ts" module>
	import { z } from "zod";

	export const formSchema = z.object({
		username: z.string().min(2).max(50),
		password: z.string().min(4).max(64),
	});

	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	let props: { form: SuperValidated<Infer<FormSchema>> } = $props();

	const form = superForm(props.form, {
		validators: zodClient(formSchema),
	});

	const { form: formData, enhance } = form;
</script>

<form use:enhance action="?/login" method="POST" autocomplete="off" class="space-y-4 p-8">
	<div class="space-y-2">
		<h1 class="text-2xl font-bold">Login</h1>
		<p class="text-muted-foreground">Enter your credentials to log in to the dashboard.</p>
	</div>

	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Username</Form.Label>
				<Input {...props} bind:value={$formData.username} placeholder="ppsre" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input {...props} type="password" bind:value={$formData.password} placeholder="*********" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button type="submit">Login</Form.Button>
</form>