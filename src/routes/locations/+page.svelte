<script lang="ts">
	import type { PageData } from "./$types";
	import InsertLevelForm from "./insert-level-form.svelte";
	import { api, SORT_DIR } from "$lib";
	import * as Table from "$lib/components/ui/table";
	import { Button } from "$lib/components/ui/button";
	import { ArrowDown10Icon, ArrowUp01Icon, ArrowUpDownIcon, RefreshCwIcon } from "lucide-svelte";
	import type { SortDirection } from "$lib/types";

	let { data }: { data: PageData } = $props();

	type RestaurantLocation = {
		locationId: number;
		name: string;
		coinsNeeded: number;
		unlocksAt: number;
	};

	let isRefreshing = $state(false);
	let locations = $state<RestaurantLocation[]>([]);

	async function fetchLocations() {
		isRefreshing = true;
		const response = await api.get("locations");
		locations = await response.json();
		isRefreshing = false;
	}

	let sortDir = $state<SortDirection>(0);

	function comparatorFn(a: RestaurantLocation, b: RestaurantLocation): number {
		if (SORT_DIR[sortDir] === "unsorted") return 0;
		const positioning = a.name.localeCompare(b.name);
		return positioning * (SORT_DIR[sortDir] === "ascending" ? 1 : -1);
	}
</script>

<div class="space-y-4">
	<div class="flex place-items-center justify-between">
		<diV>
			<h2 class="mb-2 text-3xl">Locations</h2>
			<p>Locations can be managed through here.</p>
		</diV>

		<div class="gap-2">
			<Button onclick={fetchLocations} variant="outline">
				<RefreshCwIcon class={isRefreshing ? "animate-spin" : ""} />
			</Button>
			{#await data.form then form}
				<InsertLevelForm {form} />
			{/await}
		</div>
	</div>

	<div>
		<div class="flex place-items-center justify-between">
			<h2 class="mb-2 text-xl font-medium">List of locations</h2>
		</div>

		{#if locations.length === 0}
			<div class="text-muted-foreground">
				No locations were found. Refresh the list to fetch the latest data.
			</div>
		{:else}
			<Table.Root class="rounded border">
				<Table.Header>
					<Table.Row>
						<Table.Head>Location ID</Table.Head>
						<Table.Head>
							<button
								class="flex place-items-center gap-2"
								onclick={() => (sortDir = (sortDir + 1) % SORT_DIR.length)}
							>
								Name
								{#if SORT_DIR[sortDir] === "unsorted"}
									<ArrowUpDownIcon class="size-4" />
								{:else if SORT_DIR[sortDir] === "ascending"}
									<ArrowUp01Icon class="size-4" />
								{:else if SORT_DIR[sortDir] === "descending"}
									<ArrowDown10Icon class="size-4" />
								{/if}
							</button>
						</Table.Head>
						<Table.Head>Unlocks at level</Table.Head>
						<Table.Head>Coins needed to unlock</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each locations.toSorted(comparatorFn) as location}
						<Table.Row>
							<Table.Cell>{location.locationId}</Table.Cell>
							<Table.Cell>{location.name}</Table.Cell>
							<Table.Cell>{location.unlocksAt}</Table.Cell>
							<Table.Cell>{location.coinsNeeded}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</div>
</div>
