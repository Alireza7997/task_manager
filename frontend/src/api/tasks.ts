// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import { TaskData, action } from "@/types/task_manager";

const tasks = (
	backend: string,
	table_id: number | string,
	dispatchTables: (value: action) => void
) => {
	const address = backend + `/tables/${table_id}/tasks`;

	axios
		.get<TaskData[]>(address)
		.then((results) => {
			if (results.data.length > 0) {
				dispatchTables({
					id: table_id,
					method: "ReplaceTasks",
					tasks: results.data,
				} as action);
			}
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default tasks;
