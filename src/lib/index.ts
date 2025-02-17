import ky from "ky";

export const api = ky.create({
	prefixUrl: "http://localhost:8080/api",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

export const SORT_DIR = ["unsorted", "ascending", "descending"] as const;
