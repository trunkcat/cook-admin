<script lang="ts">
	import { CircleXIcon } from "lucide-svelte";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="text-error-foreground flex flex-col place-items-center justify-center gap-2 rounded p-10"
>
	<CircleXIcon class="size-5" />
	{@render children()}
</div>
