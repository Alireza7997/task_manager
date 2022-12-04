// =============== Libraries =============== //
import { AxiosError } from "axios";
import Router from "next/router";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Stores =============== //
import AuthType from "@/types/auth";

// =============== Types =============== //
import ResponseType from "@/types/response";

interface loginResponse {
	access_token?: string;
	refresh_token?: string;
	session_id?: string;
}

interface loginRequest {
	username: string | undefined;
	password: string | undefined;
	method: string | undefined;
}

const login = (
	setErrors: (value: Record<string, string[]>) => void,
	data: loginRequest,
	auth: AuthType
) => {
	axios
		.post<ResponseType>("/auth/login", data)
		.then((results) => {
			const data = results.data.message as loginResponse;
			auth.authenticate(
				data.session_id ? data.session_id : "",
				data.access_token ? data.access_token : "",
				data.refresh_token ? data.refresh_token : ""
			);
			if (Router.pathname !== "/dashboard") Router.push("/dashboard");
		})
		.catch((reason: Error | AxiosError) => {
			const data = CatchErrorWithoutRepeat(reason);
			if (data?.status_code === 400) {
				setErrors(data.error_message as Record<string, string[]>);
			} else {
				setErrors({});
			}
		});
};

export default login;
