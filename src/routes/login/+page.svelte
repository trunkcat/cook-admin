<script lang="ts">
	import type { PageData } from "./$types";
	import LoginForm from "./login-form.svelte";
	let { data }: { data: PageData } = $props();
</script>

{#await data.form then form}
	<LoginForm {form} />
{/await}
