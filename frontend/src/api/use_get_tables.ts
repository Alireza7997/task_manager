// =============== Libraries =============== //
import { useSnackbar } from "notistack";
import { useQuery } from "react-query";
import { AxiosError, AxiosRequestConfig } from "axios";

// =============== Types =============== //
import ResponseType from "@/types/response";

// =============== Utils =============== //
import axios from "./axios";
import { TableData } from "@/types/task_manager";
import CreateNotification from "@/notification/notification";

const useGetTables = (
	projectID: number,
	headers: AxiosRequestConfig,
	enabled: boolean
) => {
	const snackProvider = useSnackbar();
	const { data, status } = useQuery(
		["projects", projectID, "tables"],
		() =>
			axios
				.get<ResponseType>(`/projects/${projectID}/tables`, headers)
				.then((value) => value.data.message as TableData[])
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
