// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import createNotification from "@/notification/notifier";

// =============== Types =============== //
import ResponseType from "@/types/response";

const CatchError = (func: () => void, reason: Error | AxiosError) => {
	if (axios.isAxiosError(reason)) {
		if (reason.response !== undefined && reason.response.data) {
			const data = reason.response?.data as ResponseType;
			createNotification(reason.response.status, data.title, "", 0);
		} else {
			createNotification(
				500,
				"No right response returned from server, retry in 10 seconds",
				"Network Error",
				0
			);
			setTimeout(func, 10000);
		}
	} else {
		createNotification(
			500,
			"Inform developers from this error happening on your system",
			"Browser Error",
			0
		);
	}
};

export function CatchErrorWithoutRepeat(
	reason: Error | AxiosError
): ResponseType | null {
	if (axios.isAxiosError(reason)) {
		if (reason.response !== undefined && reason.response.data) {
			const data = reason.response?.data as ResponseType;
			createNotification(reason.response.status, data.title, "", 0);
			return data;
		} else {
			createNotification(
				500,
				"No right response returned from server",
				"Network Error",
				0
			);
		}
	} else {
		createNotification(
			500,
			"Inform developers from this error happening on your system",
			"Browser Error",
			0
		);
	}
	return null;
}

export const CatchErrorRepeatedly = (
	func: () => void,
	reason: Error | AxiosError
) => {
	if (axios.isAxiosError(reason)) {
		if (reason.response !== undefined && reason.response.data) {
			const data = reason.response?.data as ResponseType;
			createNotification(
				reason.response.status,
				data.title + ", retry in 10 seconds",
				"",
				0
			);
		} else {
			createNotification(
				500,
				"No right response returned from server, retry in 10 seconds",
				"Network Error",
				0
			);
		}
	} else {
		createNotification(
			500,
			"Inform developers from this error happening on your system, retry in 10 seconds",
			"Browser Error",
			0
		);
	}
	setTimeout(func, 10000);
};

export default CatchError;
