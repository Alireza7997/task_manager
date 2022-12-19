// =============== Libraries =============== //
import { AxiosError, AxiosRequestConfig } from "axios";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";

// =============== Utils =============== //
import CreateNotification from "@/notification/notification";
import axios from "./axios";

// =============== Types =============== //
import ResponseType from "@/types/response";
import { TableData } from "@/types/task_manager";

const usePostTables = (projectID: number, headers: AxiosRequestConfig) => {
	const snackProvider = useSnackbar();
	const { mutateAsync, mutate } = useMutation((data: TableData) =>
		axios
			.post<ResponseType>(`/projects/${projectID}/tables`, data, headers)
			.then((value) => value.data.message as TableData)
			.catch((reason: AxiosError) => {
				const data = reason.response?.data as ResponseType;
				CreateNotification(
					data.title,
					data.message as string,
					"error",
					snackProvider
				);
				throw reason;
			})
	);

	return {
		mutate,
		mutateAsync,
	};
};

export default usePostTables;
