<script lang="ts">
	import type { PageData } from "./$types";
	import { Button } from "$lib/components/ui/button";
	import { EditIcon, PlusIcon, RefreshCwIcon } from "lucide-svelte";
	import {
		GOAL_TYPE,
		type GoalType,
		type Place,
		type PlaceItem,
		type PlaceLevel,
		type PlaceLevelGoal,
	} from "$lib/schema-types";
	import { onMount } from "svelte";
	import { api } from "$lib/api";
	import type { LoadedData } from "$lib/types";
	import LoadingCard from "$lib/components/LoadingCard.svelte";
	import FailureCard from "$lib/components/FailureCard.svelte";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { priceFormatter } from "$lib";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { toast } from "svelte-sonner";
	import * as Select from "$lib/components/ui/select";
	import { GAME_ITEMS } from "$lib/constants";

	let { data }: { data: PageData } = $props();

	type PlaceLevelType = PlaceLevel & {
		goals: PlaceLevelGoal[];
	};
	let place = $state<
		LoadedData<
			Place & {
				levels: PlaceLevelType[];
				items: PlaceItem[];
			}
		>
	>({
		state: "pending",
		message: "Loading place details...",
	});

	type AddLevelDetails = { levelNo: number } & { [K in GoalType]: number };
	const defaultAddLevelDetails: AddLevelDetails = {
		levelNo: 1,
		coins: 0,
		tip: 0,
		xp: 0,
		customers: 0,
	};
	type AddItemDetails = {
		gameItem: string;
		unlocksIn: number;
		maxLevel: number;
	};
	const defaultAddItemDetails: AddItemDetails = {
		gameItem: "",
		maxLevel: 1,
		unlocksIn: 1,
	};

	let addLevelDetails = $state<AddLevelDetails>(defaultAddLevelDetails);
	let addItemDetails = $state<AddItemDetails>(defaultAddItemDetails);

	function setDefaultLevelDetails() {
		if (place.state !== "resolved") return;
		addLevelDetails = {
			...defaultAddLevelDetails,
			levelNo: place.data.levels.reduce((p, c) => (p > c.levelNo ? p : c.levelNo), 0) + 1,
		};
	}

	function setDefaultItemDetails() {
		if (place.state !== "resolved") return;
		addItemDetails = defaultAddItemDetails;
	}

	async function fetchPlace() {
		place = { state: "pending", message: "Loading place details..." };
		const response = await api.get(`data/places/${data.placeId}`);
		if (response.ok) {
			place = { state: "resolved", data: await response.json() };
		} else {
			place = { state: "failed", message: "Failed to load place details" };
		}
	}

	onMount(() => fetchPlace());

	let showAddLevelDialog = $state(false);
	let isAddingLevel = $state(false);

	function isGoalType(type: string): type is GoalType {
		return GOAL_TYPE.some((goalType) => goalType === type);
	}

	let showAddItemDialog = $state(false);
	let isAddingItem = $state(false);
</script>

<!-- {#await data.form then form}
	<InsertLevelForm {form} bind:open={createDialogOpen} />
{/await} -->

<div class="w-full space-y-4">
	<div class="flex place-items-center justify-between gap-2">
		<div class="px-4">
			{#if place.state === "resolved"}
				<h1 class="text-2xl font-bold">{place.data.name}</h1>
			{:else}
				<Skeleton class="h-[30px] w-[100px] rounded-full" />
			{/if}
		</div>

		<div class="flex place-items-center gap-2">
			<Button variant="outline" disabled={place.state === "pending"}>
				<EditIcon /> Edit
			</Button>

			<Button onclick={fetchPlace} variant="outline" disabled={place.state === "pending"}>
				<RefreshCwIcon class={place.state === "pending" ? "animate-spin" : ""} />
				Refresh
			</Button>
		</div>
	</div>

	{#if place.state == "pending"}
		<LoadingCard>{place.message}</LoadingCard>
	{:else if place.state === "resolved"}
		<div class="space-y-6 p-4">
			<div class="space-y-4">
				<div class="flex place-items-center justify-between gap-2">
					<div>
						<h1 class="text-xl font-medium">Details</h1>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-2 *:space-y-1 *:rounded *:border *:px-4 *:py-3">
					<div class="col-span-3">
						<div class="text-sm text-muted-foreground">Description</div>
						<div>{place.data.description}</div>
					</div>

					<div>
						<div class="text-sm text-muted-foreground">Place ID</div>
						<div>{place.data.placeId}</div>
					</div>

					<div>
						<div class="text-sm text-muted-foreground">Unlocks at</div>
						<div>Level {place.data.unlocksAt}</div>
					</div>

					<div>
						<div class="text-sm text-muted-foreground">Price</div>
						<div>{priceFormatter.format(place.data.price)}</div>
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex place-items-center justify-between gap-2">
					<div>
						<h1 class="text-xl font-medium">Levels</h1>
						<h1 class="text-sm text-muted-foreground">{place.data.levels.length} levels</h1>
					</div>

					<Button onclick={() => (showAddLevelDialog = true)}>
						<PlusIcon /> Add level
					</Button>
				</div>

				{#if place.data.levels.length > 0}
					<div
						class="grid grid-cols-5 gap-2 *:flex *:place-items-center *:justify-center *:rounded *:border md:grid-cols-7"
					>
						{#each place.data.levels as level}
							<div class="aspect-square">{level.levelNo}</div>
						{/each}
					</div>
				{:else}
					<div class="text-sm text-muted-foreground">No levels added yet</div>
				{/if}
			</div>

			<div class="space-y-4">
				<div class="flex place-items-center justify-between gap-2">
					<div>
						<h1 class="text-xl font-medium">Items</h1>
						<h1 class="text-sm text-muted-foreground">{place.data.levels.length} items</h1>
					</div>

					<Button onclick={() => (showAddItemDialog = true)}>
						<PlusIcon /> Add item
					</Button>
				</div>

				<div class="grid grid-cols-2 gap-2">
					{#each place.data.items as item}
						<div class="flex place-items-center justify-between rounded-md border px-4 py-3">
							<div>
								<div class="font-medium">{item.gameItem}</div>
								<div class="text-sm">Unlocks at level {item.unlocksIn}</div>
							</div>
							<div class="text-muted-foreground">
								LVL <span class="font-bold">{item.maxLevel}</span>
							</div>
						</div>
					{:else}
						<div class="text-sm text-muted-foreground">No items added yet</div>
					{/each}
				</div>
			</div>
		</div>

		<Dialog.Root bind:open={showAddLevelDialog}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Add level</Dialog.Title>
					<Dialog.Description>Enter values and insert a new level.</Dialog.Description>
				</Dialog.Header>

				<div>
					<Label>Level number</Label>
					<Input bind:value={addLevelDetails.levelNo} type="number" min={1} />
				</div>

				<div class="grid grid-cols-4 gap-2 *:space-y-2">
					<div>
						<Label>Coins</Label>
						<Input bind:value={addLevelDetails.coins} type="number" min={0} />
					</div>
					<div>
						<Label>Tip</Label>
						<Input bind:value={addLevelDetails.tip} type="number" min={0} />
					</div>
					<div>
						<Label>XP</Label>
						<Input bind:value={addLevelDetails.xp} type="number" min={0} />
					</div>
					<div>
						<Label>Customers</Label>
						<Input bind:value={addLevelDetails.customers} type="number" min={0} />
					</div>
				</div>

				<Dialog.Footer>
					<Button
						disabled={isAddingLevel}
						onclick={async () => {
							if (isAddingLevel) return;
							if (place.state !== "resolved") return;

							isAddingLevel = true;

							const goals: { type: GoalType; value: number }[] = [];
							for (const goalType in addLevelDetails) {
								if (!isGoalType(goalType)) continue;
								const value = addLevelDetails[goalType];
								if (value > 0) goals.push({ type: goalType, value });
							}

							const response = await api.post("manager/places/level", {
								body: JSON.stringify({
									placeId: data.placeId,
									levelNo: addLevelDetails.levelNo,
									goals,
								}),
							});

							if (response.ok) {
								toast.success("Added level successfully");
								const data = await response.json<PlaceLevelType>();
								place.data.levels.push(data);
								setDefaultLevelDetails();
								showAddLevelDialog = false;
							} else {
								toast.error("Failed to add level");
							}

							isAddingLevel = false;
						}}
					>
						<PlusIcon /> Add level
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>

		<Dialog.Root bind:open={showAddItemDialog}>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Add item</Dialog.Title>
					<Dialog.Description>Enter values and insert a new item.</Dialog.Description>
				</Dialog.Header>

				<div>
					<Label>Game Item</Label>
					<Select.Root type="single" bind:value={addItemDetails.gameItem}>
						<Select.Trigger class="w-[180px]">
							{addItemDetails.gameItem == "" ? "Select a game item" : addItemDetails.gameItem}
						</Select.Trigger>
						<Select.Content>
							{#each GAME_ITEMS as gameItem}
								<Select.Item value={gameItem} label={gameItem} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="grid grid-cols-4 gap-2 *:space-y-2">
					<div>
						<Label>Unlocks in</Label>
						<Input bind:value={addItemDetails.unlocksIn} type="number" min={1} />
					</div>
					<div>
						<Label>Maximum Level</Label>
						<Input bind:value={addItemDetails.maxLevel} type="number" min={1} />
					</div>
				</div>

				<Dialog.Footer>
					<Button
						disabled={isAddingItem}
						onclick={async () => {
							if (isAddingItem) return;
							if (place.state !== "resolved") return;

							isAddingItem = true;

							const response = await api.post("manager/places/item", {
								body: JSON.stringify({
									placeId: data.placeId,
									unlocksIn: addItemDetails.unlocksIn,
									gameItem: addItemDetails.gameItem,
									maxLevel: addItemDetails.maxLevel,
								}),
							});

							if (response.ok) {
								toast.success("Added item successfully");
								const data = await response.json<PlaceItem>();
								place.data.items.push(data);
								setDefaultItemDetails();
								showAddItemDialog = false;
							} else {
								toast.error("Failed to add item");
							}

							isAddingItem = false;
						}}
					>
						<PlusIcon /> Add level
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{:else}
		<FailureCard>{place.message}</FailureCard>
	{/if}
</div>
