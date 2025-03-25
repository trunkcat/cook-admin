<script lang="ts">
	import type { PageData } from "./$types";
	import InsertLevelForm from "./insert-level-form.svelte";
	import { api, SORT_DIR } from "$lib";
	import * as Table from "$lib/components/ui/table";
	import { Button } from "$lib/components/ui/button";
	import { ArrowDown10Icon, ArrowUp01Icon, ArrowUpDownIcon, RefreshCwIcon } from "lucide-svelte";
	import type { SortDirection } from "$lib/types";

	let { data }: { data: PageData } = $props();

	type LocationLevel = {
		levelId: number;
		level: number;
		locationId: number;
		scoreRequired: number;
	};

	let isRefreshing = $state(false);
	let levels = $state<LocationLevel[]>([]);

	async function fetchLevels() {
		isRefreshing = true;
		const response = await api.get("location_levels");
		levels = await response.json();
		isRefreshing = false;
	}
	let locations = $state<{ LocationID: number; name: string }[]>([]); // Adjust structure based on API response

	async function fetchLocations() {
		const response = await api.get("locations"); 
		locations = await response.json();
	}


	let sortDir = $state<SortDirection>(0);

	function comparatorFn(a: LocationLevel, b: LocationLevel): number {
		if (SORT_DIR[sortDir] === "unsorted") return 0;
		const positioning = a.level - b.level;
		return positioning * (SORT_DIR[sortDir] === "ascending" ? 1 : -1);
	}
</script>

<div class="space-y-4">
	<div class="flex place-items-center justify-between">
		<diV>
			<h2 class="mb-2 text-3xl">Levels</h2>
			 <p>Levels can be viewed through here.</p> <!-- Change this if you implement insertion of levels -->
		</diV>

		<div class="gap-2">
			<Button onclick={fetchLevels} variant="outline">
				<RefreshCwIcon class={isRefreshing ? "animate-spin" : ""} />
			</Button>
			<!-- {#await data.form then form}
				<InsertLevelForm {form} />
			{/await} -->
		</div>
	</div>

	<div>
		<div class="flex place-items-center justify-between">
			<h2 class="mb-2 text-xl font-medium">List of levels</h2>
		</div>

		{#if levels.length === 0}
			<div class="text-muted-foreground">
				No levels were found. Refresh the list to fetch the latest data.
			</div>
		{:else}
			<Table.Root class="rounded border">
				<Table.Header>
					<Table.Row>
						<Table.Head>Level ID</Table.Head>
						<Table.Head>
							<button
								class="flex place-items-center gap-2"
								onclick={() => (sortDir = (sortDir + 1) % SORT_DIR.length)}
							>
								Level
								{#if SORT_DIR[sortDir] === "unsorted"}
									<ArrowUpDownIcon class="size-4" />
								{:else if SORT_DIR[sortDir] === "ascending"}
									<ArrowUp01Icon class="size-4" />
								{:else if SORT_DIR[sortDir] === "descending"}
									<ArrowDown10Icon class="size-4" />
								{/if}
							</button>
						</Table.Head>
						<Table.Head>Location ID</Table.Head>
						<Table.Head>Score required to unlock</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each levels.toSorted(comparatorFn) as level}
						<Table.Row>
							<Table.Cell>{level.levelId}</Table.Cell>
							<Table.Cell>{level.level}</Table.Cell>
							<Table.Cell>{level.locationId}</Table.Cell>
							<Table.Cell>{level.scoreRequired}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</div>
</div>
