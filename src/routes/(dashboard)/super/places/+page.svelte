<script lang="ts">
	import type { PageData } from "./$types";
	import InsertLevelForm from "./insert-place-form.svelte";
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
	import type { Place } from "$lib/schema-types";
	import { onMount } from "svelte";
	import SearchBox from "$lib/components/SearchBox.svelte";
	import { api } from "$lib/api";
	import { goto } from "$app/navigation";

	let { data }: { data: PageData } = $props();

	let isRefreshing = $state(true);
	let places = $state<Place[]>([]);

	async function fetchPlaces() {
		isRefreshing = true;
		const response = await api.get("data/places");
		places = await response.json();
		isRefreshing = false;
	}

	onMount(() => fetchPlaces());

	let sortDir = $state<SortDirection>(0);

	function comparatorFn(a: Place, b: Place): number {
		if (SORT_DIR[sortDir] === "unsorted") return 0;
		const positioning = a.name.localeCompare(b.name);
		return positioning * (SORT_DIR[sortDir] === "ascending" ? 1 : -1);
	}

	let searchString = $state("");
	let createDialogOpen = $state(false);

	function filterFn(place: Place) {
		return (
			place.placeId.toString().startsWith(searchString) ||
			place.name.toLowerCase().includes(searchString.toLowerCase())
		);
	}

	let tableColumns = $state<HTMLTableRowElement | null>(null);

	const priceFormatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
</script>

{#await data.form then form}
	<InsertLevelForm {form} bind:open={createDialogOpen} />
{/await}

<div class="w-full space-y-4">
	<div class="flex place-items-center justify-between gap-2">
		<SearchBox placeholder="Search" bind:value={searchString} />
		<div class="flex place-items-center gap-2">
			<Button onclick={() => (createDialogOpen = true)}>
				<PlusIcon /> Create
			</Button>
			<Button onclick={fetchPlaces} variant="outline" disabled={isRefreshing}>
				<RefreshCwIcon class={isRefreshing ? "animate-spin" : ""} />
				Refresh
			</Button>
		</div>
	</div>

	<Table.Root>
		<Table.Header>
			<Table.Row bind:ref={tableColumns}>
				<Table.Head class="text-center">Place ID</Table.Head>
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
				<Table.Head class="text-center">Type</Table.Head>
				<Table.Head class="text-center">Unlocks at</Table.Head>
				<Table.Head class="text-center">Price</Table.Head>
				<Table.Head class="text-center">(X, Y)</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each places.toSorted(comparatorFn).filter(filterFn) as place}
				<Table.Row class="table-row cursor-pointer" onclick={() => goto(`places/${place.placeId}`)}>
					<Table.Cell class="py-4 text-center">{place.placeId}</Table.Cell>
					<Table.Cell>{place.name}</Table.Cell>
					<Table.Cell class="text-center">{place.type}</Table.Cell>
					<Table.Cell class="text-center">{place.unlocksAt}</Table.Cell>
					<Table.Cell class="text-center">{priceFormatter.format(place.price)}</Table.Cell>
					<Table.Cell class="text-center">({place.position[0]}, {place.position[1]})</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={tableColumns?.cells.length ?? 99}>
						<div class="flex place-items-center justify-center rounded p-6 text-muted-foreground">
							<div class="text-center text-sm">
								{#if isRefreshing}
									Loading...
								{:else}
									No places were found. Refresh the list to fetch the latest data.
								{/if}
							</div>
						</div>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
