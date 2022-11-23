// =============== Libraries =============== //
import Router from "next/router";

// =============== Utils =============== //
import axios from "./axios";
import createNotification from "@/notification/notifier";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import ResponseType from "@/types/response";

interface RegisterRequestResponse {
	username: string;
	email: string;
	password: string;
}

const register = (
	setErrors: (value: Record<string, string[]>) => void,
	data: RegisterRequestResponse
) => {
	axios
		.post<ResponseType>("/auth/register", data)
		.then(() => {
			createNotification(
				200,
				"Now log into your account.",
				"Register Succeed",
				0
			);
			if (Router.pathname !== "/login") Router.push("/login");
		})
		.catch((reason) => {
			const data = CatchErrorWithoutRepeat(reason);
			if (data !== null && data.status_code === 400) {
				setErrors(data.error_message as Record<string, string[]>);
			} else {
				setErrors({});
			}
		});
};

export default register;
