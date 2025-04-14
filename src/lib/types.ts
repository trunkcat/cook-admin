import type { SORT_DIR } from "$lib";
import type { Icon } from "lucide-svelte";

export type ArrayIndices<
	T extends ReadonlyArray<unknown>,
	B = keyof T,
> = B extends `${infer N extends number}` ? N : never;
export type SortDirection = ArrayIndices<typeof SORT_DIR>;

export type ApiResult<T> = { ok: false; message: string } | { ok: true; data: T };

export type LoadedSuccess<T> = { state: "resolved"; data: T };
export type LoadedPending = { state: "pending"; message: string };
export type LoadedFailure = { state: "failed"; message: string };
export type LoadedData<T> = LoadedSuccess<T> | LoadedPending | LoadedFailure;

export type SidebarItem = { title: string; url: string; icon: typeof Icon };
