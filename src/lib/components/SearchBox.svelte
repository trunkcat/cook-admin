<script lang="ts">
	import Input from "$lib/components/ui/input/input.svelte";
	import { cn } from "$lib/shadcn-utils";
	import { DeleteIcon, SearchIcon } from "lucide-svelte";

	let {
		value = $bindable(""),
		placeholder = $bindable(""),
	}: { value: string; placeholder?: string } = $props();
</script>

<div class="relative flex w-full items-center">
	<SearchIcon class="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform opacity-70" />
	<Input {placeholder} bind:value class="px-10 py-4 text-sm" />
	<button
		class="absolute right-3 top-1/2 -translate-y-1/2 transform p-0 opacity-70"
		onclick={() => (value = "")}
	>
		<DeleteIcon
			class={cn("size-4 transition-all duration-200", value.length == 0 && "opacity-0")}
		/>
	</button>
</div>
