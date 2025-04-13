// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Manager, ManagerSession } from "$lib/schema-types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session:
				| (ManagerSession & {
						manager: Omit<Manager, "passwordHash">;
				  })
				| null;
			sessionToken: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
