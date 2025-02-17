<script lang="ts">
	let { children } = $props();
</script>

<div class="mx-auto max-w-screen-lg items-center p-8">
	{@render children()}
</div>
