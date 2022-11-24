// =============== Libraries =============== //
import { AxiosError } from "axios";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import { action, TaskData } from "@/types/task_manager";
import Auth from "@/types/auth";
import ResponseType from "@/types/response";

const add_task = (
	auth: Auth,
	data: Record<string, string>,
	table_id: number | string,
	dispatchTables: (value: action) => void
) => {
	axios
		.post<ResponseType>(
			`/tables/${table_id}/tasks`,
			data,
			auth.getAuthHeaders()
		)
		.then((results) => {
			const data = results.data.message as TaskData;
			dispatchTables({
				id: table_id,
				method: "AddTask",
				tasks: [data],
			} as action);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default add_task;
