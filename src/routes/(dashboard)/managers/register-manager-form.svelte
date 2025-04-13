<script lang="ts" module>
	import { z } from "zod";

	export const formSchema = z.object({
		username: z.string().min(3),
		email: z.string().email(),
		password: z.string().min(6)
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
</script>

<Dialog.Root bind:open onOpenChange={() => form.reset()}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Register Manager</Dialog.Title>
			<Dialog.Description>Fill out the details to add a new manager.</Dialog.Description>
		</Dialog.Header>

		<form use:enhance action="?/insert" method="POST" autocomplete="off" class="space-y-2">
			<Form.Field {form} name="username">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Username</Form.Label>
						<Input {...props} bind:value={$formData.username} placeholder="Username" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input {...props} type="email" bind:value={$formData.email} placeholder="Email" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Password</Form.Label>
						<Input {...props} type="password" bind:value={$formData.password} placeholder="Password" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button type="submit">
				{#if $submitting}
					<LoaderCircleIcon class="animate-spin" /> Registering...
				{:else}
					<PlusIcon /> Register Manager
				{/if}
			</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
