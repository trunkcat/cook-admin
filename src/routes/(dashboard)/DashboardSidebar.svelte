<script lang="ts">
	import { goto } from "$app/navigation";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { ChevronUpIcon, HouseIcon, MapPinIcon } from "lucide-svelte";

	const dashboardItems = [
		{
			title: "Home",
			url: "/",
			icon: HouseIcon,
		},
		{
			title: "Places",
			url: "/places",
			icon: MapPinIcon,
		},
	];

	const { username }: { username: string } = $props();
</script>

<Sidebar.Root variant="inset">
	<Sidebar.Header />

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Dashboard</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each dashboardItems as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								{...props}
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								{username}
								<ChevronUpIcon class="ml-auto" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
						<DropdownMenu.Item>
							<span>Account</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => goto("/logout")}>
							<span>Log out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
