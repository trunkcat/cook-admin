<script lang="ts" module>
	import { z } from "zod";

	export const formSchema = z.object({
		name: z.string().min(3),
		type: z.enum(PLACE_TYPE),
		description: z.string().min(16).max(256),
		price: z.number().nonnegative().default(0),
		unlocksAt: z.number().positive().default(1),
		positionX: z.number().default(0),
		positionY: z.number().default(0),
	});

	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { LoaderCircleIcon, PlusIcon } from "lucide-svelte";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Select from "$lib/components/ui/select";
	import { PLACE_TYPE, type PlaceType } from "$lib/schema-types";
	import { Textarea } from "$lib/components/ui/textarea";
	import { toast } from "svelte-sonner";
	import { page } from "$app/stores";

	let {
		open = $bindable(),
		form: baseForm,
	}: {
		open: boolean;
		form: SuperValidated<Infer<FormSchema>>;
	} = $props();

	const form = superForm(baseForm, {
		validators: zodClient(formSchema),
		delayMs: 1000,
		clearOnSubmit: "errors-and-message",
		onError: (event) => {
			message.set(event.result.error.message);
			toast.error(event.result.error.message);
		},
	});

	$effect(() => {
		if (
			$message != null &&
			typeof $message == "object" &&
			$message.message != null &&
			typeof $message.message === "string" &&
			$page.status == 200
		) {
			toast.success($message.message);
		}
	});

	const { form: formData, enhance, submitting, message } = form;

	const placeTypes: Record<PlaceType, string> = {
		restaurant: "Restaurant",
	};
</script>

<Dialog.Root bind:open onOpenChange={() => form.reset()}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add place</Dialog.Title>
			<Dialog.Description>Enter values and insert a new place.</Dialog.Description>
		</Dialog.Header>

		<form use:enhance action="?/insert" method="POST" autocomplete="off" class="space-y-2">
			<div class="flex place-items-start gap-2">
				<Form.Field {form} name="name" class="flex-grow">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Name</Form.Label>
							<Input {...props} bind:value={$formData.name} placeholder="Place Name" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="type">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Type</Form.Label>
							<Select.Root type="single" name={props.name} bind:value={$formData.type}>
								<Select.Trigger class="w-[180px]">
									{placeTypes[$formData.type]}
								</Select.Trigger>
								<Select.Content>
									{#each Object.entries(placeTypes) as [value, label] (value)}
										<Select.Item {value} {label} />
									{/each}
								</Select.Content>
							</Select.Root>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<Form.Field {form} name="description">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Description</Form.Label>
						<Textarea
							{...props}
							bind:value={$formData.description}
							placeholder="Enter a description for the place to show up before buying"
							rows={5}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="flex place-items-start gap-2">
				<Form.Field {form} name="unlocksAt" class="flex-grow">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Unlocks at</Form.Label>
							<Input {...props} type="number" bind:value={$formData.unlocksAt} placeholder="5" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="price" class="flex-grow">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Price</Form.Label>
							<Input {...props} type="number" bind:value={$formData.price} placeholder="5000" />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="positionX" class="w-fit">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>X</Form.Label>
							<Input {...props} type="number" bind:value={$formData.positionX} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="positionY" class="w-fit">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Y</Form.Label>
							<Input {...props} type="number" bind:value={$formData.positionY} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<Form.Button type="submit">
				{#if $submitting}
					<LoaderCircleIcon class="animate-spin" /> Adding...
				{:else}
					<PlusIcon /> Add place
				{/if}
			</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>