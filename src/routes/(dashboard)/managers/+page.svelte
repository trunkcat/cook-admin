<script lang="ts">
	import type { PageData } from "./$types";
	import RegisterManagerForm from "./register-manager-form.svelte";
	import { SORT_DIR } from "$lib";
	import * as Table from "$lib/components/ui/table";
	import { Button } from "$lib/components/ui/button";
	import {
		ArrowDown10Icon,
		ArrowUp01Icon,
		ArrowUpDownIcon,
		PlusIcon,
		RefreshCwIcon,
	} from "lucide-svelte";
	import type { SortDirection } from "$lib/types";
	import type { Manager } from "$lib/schema-types";
	import { onMount } from "svelte";
	import SearchBox from "$lib/components/SearchBox.svelte";

	let { data }: { data: PageData } = $props();

	let isRefreshing = $state(false);
	let managers = $state<Manager[]>([]);

	async function fetchManagers() {
		isRefreshing = true;
		const response = await fetch("/api/common/managers");
		managers = (await response.json()).data;
		isRefreshing = false;
	}

	onMount(() => fetchManagers());

	let sortDir = $state<SortDirection>(0);

	function comparatorFn(a: Manager, b: Manager): number {
		if (SORT_DIR[sortDir] === "unsorted") return 0;
		const positioning = a.username.localeCompare(b.username);
		return positioning * (SORT_DIR[sortDir] === "ascending" ? 1 : -1);
	}

	let searchString = $state("");
	let createDialogOpen = $state(false);

	function filterFn(manager: Manager) {
		return (
			manager.managerId.toString().startsWith(searchString) ||
			manager.username.toLowerCase().includes(searchString.toLowerCase())
		);
	}

	let tableColumns = $state<HTMLTableRowElement | null>(null);

	const priceFormatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
</script>

{#await data.form then form}
	<RegisterManagerForm {form} bind:open={createDialogOpen} />
{/await}

<div class="w-full space-y-4">
	<div class="flex place-items-center justify-between gap-2">
		<SearchBox placeholder="Search" bind:value={searchString} />
		<div class="flex place-items-center gap-2">
			<Button onclick={() => (createDialogOpen = true)}>
				<PlusIcon /> Create
			</Button>
			<Button onclick={fetchManagers} variant="outline" disabled={isRefreshing}>
				<RefreshCwIcon class={isRefreshing ? "animate-spin" : ""} />
				Refresh
			</Button>
		</div>
	</div>

	<Table.Root>
		<Table.Header>
			<Table.Row bind:ref={tableColumns}>
				<Table.Head class="text-center">ID</Table.Head>
				<Table.Head
					class="flex cursor-pointer place-items-center gap-2"
					onclick={() => (sortDir = (sortDir + 1) % SORT_DIR.length)}
				>
					Name
					{#if SORT_DIR[sortDir] === "unsorted"}
						<ArrowUpDownIcon class="size-3" />
					{:else if SORT_DIR[sortDir] === "ascending"}
						<ArrowUp01Icon class="size-3" />
					{:else if SORT_DIR[sortDir] === "descending"}
						<ArrowDown10Icon class="size-3" />
					{/if}
				</Table.Head>
				<Table.Head class="text-center">Email</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each managers.toSorted(comparatorFn).filter(filterFn) as manager}
				<Table.Row class="table-row cursor-pointer">
					<Table.Cell class="py-4 text-center">{manager.managerId}</Table.Cell>
					<Table.Cell>{manager.username}</Table.Cell>
					<Table.Cell class="text-center">{manager.email}</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={tableColumns?.cells.length ?? 99}>
						<div class="flex place-items-center justify-center rounded p-6 text-muted-foreground">
							<div class="text-center text-sm">
								{#if isRefreshing}
									Loading...
								{:else}
									No managers were found. Refresh the list to fetch the latest data.
								{/if}
							</div>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
