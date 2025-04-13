import type { SORT_DIR } from "$lib";

export type ArrayIndices<
	T extends ReadonlyArray<unknown>,
	B = keyof T,
> = B extends `${infer N extends number}` ? N : never;
export type SortDirection = ArrayIndices<typeof SORT_DIR>;

export type Result<T> = { ok: false; message: string } | { ok: true; data: T };
