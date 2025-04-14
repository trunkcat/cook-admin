<script lang="ts">
	import { page } from "$app/state";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import type { ManagerRole } from "$lib/schema-types";
	import { MapPinIcon, SettingsIcon, ShieldCheckIcon } from "lucide-svelte";
	import type { LayoutProps } from "./$types";
	import DashboardSidebar from "./DashboardSidebar.svelte";
	import type { SidebarItem } from "$lib/types";

	const sidebarItems: Record<ManagerRole, SidebarItem[]> = {
		manager: [
			{ title: "Events", url: "/events", icon: MapPinIcon },
			{ title: "Settings", url: "/settings", icon: SettingsIcon },
		].map((item) => ({ ...item, url: "/manager" + item.url })),
		supermanager: [
			{ title: "Places", url: "/places", icon: MapPinIcon },
			{ title: "Managers", url: "/managers", icon: ShieldCheckIcon },
			{ title: "Settings", url: "/settings", icon: SettingsIcon },
		].map((item) => ({ ...item, url: "/super" + item.url })),
	};

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<title>{page.data.title ?? page.url}</title>
</svelte:head>

<Sidebar.Provider open={data.sidebarOpen}>
	<DashboardSidebar username={data.username} items={sidebarItems[data.role]} />

	<Sidebar.Inset>
		<main class="w-full">
			<nav
				class="sticky top-0 z-[1] flex place-items-center gap-4 border-b bg-background/50 p-3 backdrop-blur-lg"
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
