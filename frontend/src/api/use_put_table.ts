// =============== Libraries =============== //
import { AxiosError, AxiosRequestConfig } from "axios";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";

// =============== Utils =============== //
import CreateNotification from "@/notification/notification";
import axios from "./axios";

// =============== Types =============== //
import ResponseType from "@/types/response";
import { action, TableData } from "@/types/task_manager";

const usePutTable = (
	tableID: number,
	headers: AxiosRequestConfig,
	dispatchTables: (value: action) => void
) => {
	const snackProvider = useSnackbar();
	const { mutateAsync, mutate } = useMutation((data: TableData) =>
		axios
			.put<ResponseType>(`/tables/${tableID}`, data, headers)
			.then((value) => {
				const data = value.data.message as TableData;
				dispatchTables({
					id: tableID,
					method: "ReplaceTable",
					tables: [data],
				} as action);
				CreateNotification(
					"Success",
					`'${data.title}' table edited`,
					"success",
					snackProvider
				);
			})
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

export default usePutTable;
