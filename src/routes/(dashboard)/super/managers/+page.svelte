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
	import type { LoadedData, SortDirection } from "$lib/types";
	import type { Manager } from "$lib/schema-types";
	import { onMount } from "svelte";
	import SearchBox from "$lib/components/SearchBox.svelte";
	import { api } from "$lib/api";
	import LoadingCard from "$lib/components/LoadingCard.svelte";
	import FailureCard from "$lib/components/FailureCard.svelte";

	let { data }: { data: PageData } = $props();

	type ManagerS = Omit<Manager, "passwordHash">;

	let managers = $state<LoadedData<ManagerS[]>>({
		state: "pending",
		message: "Loading managers details...",
	});

	async function fetchManagers() {
		managers = { state: "pending", message: "Loading managers details..." };
		const response = await api.get("manager/all-managers");
		if (response.ok) {
			managers = { state: "resolved", data: await response.json() };
		} else {
			managers = { state: "failed", message: "Failed to load managers details" };
		}
	}

	onMount(() => fetchManagers());

	let sortDir = $state<SortDirection>(0);

	function comparatorFn(a: ManagerS, b: ManagerS): number {
		if (SORT_DIR[sortDir] === "unsorted") return 0;
		const positioning = a.username.localeCompare(b.username);
		return positioning * (SORT_DIR[sortDir] === "ascending" ? 1 : -1);
	}

	let searchString = $state("");
	let createDialogOpen = $state(false);

	function filterFn(manager: ManagerS) {
		return (
			manager.managerId.toString().startsWith(searchString) ||
			manager.username.toLowerCase().includes(searchString.toLowerCase())
		);
	}

	let tableColumns = $state<HTMLTableRowElement | null>(null);
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

			<Button onclick={fetchManagers} variant="outline" disabled={managers.state === "pending"}>
				<RefreshCwIcon class={managers.state === "pending" ? "animate-spin" : ""} />
				Refresh
			</Button>
		</div>
	</div>

	{#if managers.state == "pending"}
		<LoadingCard>{managers.message}</LoadingCard>
	{:else if managers.state === "resolved"}
		<Table.Root>
			<Table.Header>
				<Table.Row bind:ref={tableColumns}>
					<Table.Head
						class="flex cursor-pointer place-items-center gap-2"
						onclick={() => (sortDir = (sortDir + 1) % SORT_DIR.length)}
					>
						Username
						{#if SORT_DIR[sortDir] === "unsorted"}
							<ArrowUpDownIcon class="size-3" />
						{:else if SORT_DIR[sortDir] === "ascending"}
							<ArrowUp01Icon class="size-3" />
						{:else if SORT_DIR[sortDir] === "descending"}
							<ArrowDown10Icon class="size-3" />
						{/if}
					</Table.Head>
					<Table.Head>Email</Table.Head>
					<!-- <Table.Head>ID</Table.Head> -->
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each managers.data.toSorted(comparatorFn).filter(filterFn) as manager}
					<Table.Row class="table-row cursor-pointer">
						<Table.Cell class="py-4">{manager.username}</Table.Cell>
						<Table.Cell>{manager.email}</Table.Cell>
						<!-- <Table.Cell>{manager.managerId}</Table.Cell> -->
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={tableColumns?.cells.length ?? 99}>
							<div class="flex place-items-center justify-center rounded p-6 text-muted-foreground">
								<div class="text-center text-sm">
									No managers were found. Refresh the list to fetch the latest data.
								</div>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<FailureCard>{managers.message}</FailureCard>
	{/if}
</div>
