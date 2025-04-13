<script lang="ts">
	import { page } from "$app/state";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import DashboardSidebar from "./DashboardSidebar.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>{page.data.title ?? page.url}</title>
</svelte:head>

<Sidebar.Provider>
	<DashboardSidebar username={page.data.username} />

	<Sidebar.Inset>
		<main class="w-full">
			<nav
				class="sticky top-0 z-10 flex place-items-center gap-4 border-b bg-background/50 p-3 backdrop-blur-lg"
			>
				<Sidebar.Trigger class="size-10" />
				<h1 class="font-medium">{page.data.title}</h1>
			</nav>
			<div class="px-4 py-4">
				{@render children()}
			</div>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
