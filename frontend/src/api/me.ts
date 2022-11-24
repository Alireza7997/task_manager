// =============== Libraries =============== //
import { AxiosError, AxiosRequestConfig } from "axios";
import Router from "next/router";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import UserType from "@/types/user";
import ResponseType from "@/types/response";
import AuthType from "@/types/auth";

export interface MeResponse {
	username: string;
	email: string;
	created_at: string;
}

function me(auth: AuthType): () => void {
	return () => {
		axios
			.get<ResponseType>("/user/me", auth.getAuthHeaders())
			.then((results) => {
				const data = results.data.message as MeResponse;
				auth.setUser(new UserType(data.username, data.email, data.created_at));
			})
			.catch((reason: Error | AxiosError) => {
				const data = CatchErrorWithoutRepeat(reason);
				if (data?.status_code === 401)
					auth.refreshJWT((auth: AuthType) => me(auth)());
				else auth.resetAuth();
			});
	};
}

export default me;
