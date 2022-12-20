// =============== Libraries =============== //
import { useSnackbar } from "notistack";
import { useQuery } from "react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import orderBy from "lodash/orderBy";
import findIndex from "lodash/findIndex";
import includes from "lodash/includes";

// =============== Types =============== //
import ResponseType from "@/types/response";

// =============== Utils =============== //
import axios from "./axios";
import { action, TaskData } from "@/types/task_manager";
import CreateNotification from "@/notification/notification";

const OrderTasks = (tasks: TaskData[]): TaskData[] => {
	const nexts = tasks.map((value) => value.next);
	let head: TaskData | null = null;
	for (let index = 0; index < tasks.length; index++) {
		const element = tasks[index];
		if (!includes(nexts, element.id)) {
			head = element;
			break;
		}
	}
	if (head === null) {
		return tasks;
	}
	const output: TaskData[] = [head];
	let j = 0;
	for (let index = head.next; j < tasks.length; j++) {
		if (index === 0) {
			break;
		}
		const foundIndex = findIndex(tasks, (value) => value.id === index);
		if (foundIndex === -1) {
			return output;
		} else {
			output.push(tasks[foundIndex]);
			index = tasks[foundIndex].next;
		}
	}
	return output;
};

const useGetTasks = (
	tableID: number,
	headers: AxiosRequestConfig,
	enabled: boolean,
	dispatchTables: (value: action) => void
) => {
	const snackProvider = useSnackbar();
	const { data, status } = useQuery(
		["tables", tableID, "tasks"],
		() =>
			axios
				.get<ResponseType>(`/tables/${tableID}/tasks`, headers)
				.then((value) => {
					const data = orderBy(value.data.message as TaskData[], (value) => {
						value.next;
					}).reverse();
					dispatchTables({
						id: tableID,
						method: "ReplaceTasks",
						tasks: OrderTasks(data),
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

export default useGetTasks;
