import { redirect } from "@sveltejs/kit";
import ky, { type AfterResponseHook } from "ky";

const unauthorizedHook: AfterResponseHook = async (request, options, response) => {
	if (response.status === 401) {
		throw redirect(307, "/login");
	}
	return response;
};

export const api = ky.create({
	prefixUrl: "http://192.168.1.8:8080/api",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
	credentials: "include",
	hooks: { afterResponse: [unauthorizedHook] },
});
