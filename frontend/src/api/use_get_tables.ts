// =============== Libraries =============== //
import { useSnackbar } from "notistack";
import { useQuery } from "react-query";
import { AxiosError, AxiosRequestConfig } from "axios";

// =============== Types =============== //
import ResponseType from "@/types/response";

// =============== Utils =============== //
import axios from "./axios";
import { action, TableData } from "@/types/task_manager";
import CreateNotification from "@/notification/notification";

const useGetTables = (
	projectID: number,
	headers: AxiosRequestConfig,
	enabled: boolean,
	dispatchTables: (value: action) => void
) => {
	const snackProvider = useSnackbar();
	const { data, status } = useQuery(
		["projects", projectID, "tables"],
		() =>
			axios
				.get<ResponseType>(`/projects/${projectID}/tables`, headers)
				.then((value) => {
					const data = value.data.message as TableData[];
					dispatchTables({
						id: projectID,
						method: "Replace",
						tables: data,
					} as action);
					return data;
				})
				.catch((reason: AxiosError) => {
					const data = reason.response?.data as ResponseType;
					CreateNotification(
						data.title,
						data.message as string,
						"error",
						snackProvider
					);
					throw reason;
				}),
		{ enabled: enabled, refetchOnWindowFocus: false, retry: 0 }
	);

	return { data, status };
};

export default useGetTables;
