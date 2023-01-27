// =============== Libraries =============== //
import { useSnackbar } from "notistack";
import { useQuery } from "react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import includes from "lodash/includes";
import findIndex from "lodash/findIndex";

// =============== Types =============== //
import ResponseType from "@/types/response";

// =============== Utils =============== //
import axios from "./axios";
import { action, TableData } from "@/types/task_manager";
import CreateNotification from "@/notification/notification";

const OrderTables = (tables: TableData[]): TableData[] => {
	const nexts = tables.map((value) => value.next);
	let head: TableData | null = null;
	for (let index = 0; index < tables.length; index++) {
		const element = tables[index];
		if (!includes(nexts, element.id)) {
			head = element;
			break;
		}
	}
	if (head === null) {
		return tables;
	}
	const output: TableData[] = [head];
	let j = 0;
	for (let next = head.next; j < tables.length; j++) {
		if (next === 0) {
			break;
		}
		const foundIndex = findIndex(tables, (value) => value.id === next);
		if (foundIndex === -1) {
			return output;
		} else {
			output.push(tables[foundIndex]);
			next = tables[foundIndex].next;
		}
	}
	return output;
};

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
						tables: OrderTables(data),
					} as action);
					return data;
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
				}),
		{ enabled: enabled, refetchOnWindowFocus: false, retry: 0 }
	);

	return { data, status };
};

export default useGetTables;
