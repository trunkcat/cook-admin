<script lang="ts" module>
	import { z } from "zod";

	export const formSchema = z.object({
		name: z.string().min(3),
		coins_needed: z.number().positive().default(1000),
		unlocks_at: z.number().positive().default(1),
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
			<Dialog.Title>Add location</Dialog.Title>
			<Dialog.Description>Enter values and insert a new location.</Dialog.Description>
		</Dialog.Header>

		<form use:enhance action="?/insert" method="POST" autocomplete="off" class="space-y-4">
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name</Form.Label>
						<Input {...props} bind:value={$formData.name} placeholder="Pizza Plaza" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="flex place-items-center gap-2">
				<Form.Field {form} name="unlocks_at" class="flex-grow">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Unlocks at Level</Form.Label>
							<Input {...props} type="number" bind:value={$formData.unlocks_at} placeholder="5" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="coins_needed" class="flex-grow">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Coins needed to buy</Form.Label>
							<Input
								{...props}
								type="number"
								bind:value={$formData.coins_needed}
								placeholder="5000"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<Form.Button type="submit">
				<PlusIcon /> Add location
			</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
