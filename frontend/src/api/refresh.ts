// =============== Libraries =============== //
import { AxiosError, AxiosRequestConfig } from "axios";
import Router from "next/router";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import ResponseType from "@/types/response";
import AuthType from "@/types/auth";

//! Going to get fixed
interface RefreshResponse {
	new_access_token: string;
	new_refresh_token: string;
}

interface RefreshRequest {
	token: string;
}

export default function refresh(
	data: RefreshRequest,
	auth: AuthType,
	operation: (auth: AuthType) => void
): () => void {
	return () => {
		axios
			.post<ResponseType>("/auth/refresh", data)
			.then((results) => {
				const data = results.data.message as RefreshResponse;
				auth.refreshAccessRefreshToken(
					data.new_access_token,
					data.new_refresh_token
				);
				operation(auth);
			})
			.catch((reason: Error | AxiosError) => {
				CatchErrorWithoutRepeat(reason);
				auth.resetAuth();
				if (Router.pathname !== "/login") Router.push("/login");
			});
	};
}
