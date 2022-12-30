// =============== Libraries =============== //
import { AxiosError, AxiosRequestConfig } from "axios";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";

// =============== Utils =============== //
import CreateNotification from "@/notification/notification";
import axios from "./axios";

// =============== Types =============== //
import ResponseType from "@/types/response";

const useDeleteTask = (taskID: number, headers: AxiosRequestConfig) => {
	const snackProvider = useSnackbar();
	const { mutateAsync, mutate } = useMutation(() =>
		axios
			.delete<ResponseType>(`/tasks/${taskID}`, headers)
			.catch((reason: AxiosError) => {
				const data = reason.response?.data as ResponseType;
				if (data) {
					CreateNotification(
						data.title,
						data.message as string,
						"error",
						snackProvider
					);
				} else {
					CreateNotification(
						"Unknown",
						"An unknown error happened",
						"error",
						snackProvider
					);
				}
				throw reason;
			})
	);

	return {
		mutate,
		mutateAsync,
	};
};

export default useDeleteTask;
