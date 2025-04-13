import { PUBLIC_BACKEND_URL } from "$env/static/public";
import ky from "ky";

export const api = ky.create({
	prefixUrl: PUBLIC_BACKEND_URL + "/api",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
	credentials: "include",
	throwHttpErrors: false,
});
