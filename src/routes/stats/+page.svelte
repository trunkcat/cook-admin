<script lang="ts">
	import type { PageData } from "./$types";
	import { api, SORT_DIR } from "$lib";
	import * as Table from "$lib/components/ui/table";
	import { Button } from "$lib/components/ui/button";
	import { ArrowDown10Icon, ArrowUp01Icon, ArrowUpDownIcon, RefreshCwIcon } from "lucide-svelte";
	import type { SortDirection } from "$lib/types";

	let { data }: { data: PageData } = $props();

	type PlayerStats = {
		playerID: number;
		playerLevel: number;
		coins: number;
		experiencePoints: number;
	};

	let isRefreshing = $state(false);
	let stats = $state<PlayerStats[]>([]);

	async function fetchStats() {
		isRefreshing = true;
		const response = await api.get("player_stats");
		stats = await response.json();
		console.log(stats);
		isRefreshing = false;
	}

	let sortDir = $state<SortDirection>(0);

	function comparatorFn(a: PlayerStats, b: PlayerStats): number {
		if (SORT_DIR[sortDir] === "unsorted") return 0;
		const positioning = a.playerLevel - b.playerLevel;
		return positioning * (SORT_DIR[sortDir] === "ascending" ? 1 : -1);
	}
</script>

<div class="space-y-4">
	<div class="flex place-items-center justify-between">
		<diV>
			<h2 class="mb-2 text-3xl">Levels</h2>
			 <p>Player status can be viewed through here.</p> <!-- Change this if you implement insertion of levels -->
		</diV>

		<div class="gap-2">
			<Button onclick={fetchStats} variant="outline">
				<RefreshCwIcon class={isRefreshing ? "animate-spin" : ""} />
			</Button>
			<!-- {#await data.form then form}
				<InsertLevelForm {form} />
			{/await} -->
		</div>
	</div>

	<div>
		<div class="flex place-items-center justify-between">
			<h2 class="mb-2 text-xl font-medium">List of Players</h2>
		</div>

		{#if stats.length === 0}
			<div class="text-muted-foreground">
				No players were found. Refresh the list to fetch the latest data.
			</div>
		{:else}
			<Table.Root class="rounded border">
				<Table.Header>
					<Table.Row>
						<Table.Head>Player ID</Table.Head>
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
						<Table.Head> Coins</Table.Head>
						<Table.Head>XP</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each stats.toSorted(comparatorFn) as stat}
						<Table.Row>
							<Table.Cell>{stat.playerID}</Table.Cell>
							<Table.Cell>{stat.playerLevel}</Table.Cell>
							<Table.Cell>{stat.coins}</Table.Cell>
							<Table.Cell>{stat.experiencePoints}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</div>
</div>
