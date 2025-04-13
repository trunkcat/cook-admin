<script lang="ts" module>
	import { z } from "zod";

	export const formSchema = z.object({
		level: z.number().positive().default(1000),
		locationId: z.number().positive().default(1000),
		scoreRequired: z.number().positive().default(1),
	});

	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { PlusIcon } from "lucide-svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import { buttonVariants } from "$lib/components/ui/button";

	let props: { form: SuperValidated<Infer<FormSchema>> } = $props();

	const form = superForm(props.form, {
		validators: zodClient(formSchema),
	});

	const { form: formData, enhance } = form;
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "default" })}>
		<PlusIcon />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Location Level</Dialog.Title>
			<Dialog.Description>Enter values to insert a new location level.</Dialog.Description>
		</Dialog.Header>

		<form use:enhance action="?/insert" method="POST" autocomplete="off" class="space-y-4">
			<Form.Field {form} name="level">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Level</Form.Label>
						<Input {...props} type="number" bind:value={$formData.level} placeholder="1000" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="locationId">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Location ID</Form.Label>
						<Input {...props} type="number" bind:value={$formData.locationId} placeholder="1000" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="scoreRequired">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Score Required</Form.Label>
						<Input {...props} type="number" bind:value={$formData.scoreRequired} placeholder="1" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button type="submit">
				<PlusIcon /> Add Location Level
			</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
