// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import { action, TaskData } from "@/types/task_manager";

const add_task = (
	backend: string,
	data: Record<string, string>,
	table_id: number | string,
	dispatchTables: (value: action) => void
) => {
	const address = backend + `/tasks`;

	axios
		.post<TaskData>(address, data)
		.then((results) => {
			dispatchTables({
				id: table_id,
				method: "AddTask",
				tasks: [results.data],
			} as action);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default add_task;
