// =============== Libraries =============== //
import { AxiosError } from "axios";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import { TaskData, action } from "@/types/task_manager";
import ResponseType from "@/types/response";
import Auth from "@/types/auth";

const get_tasks = (
	auth: Auth,
	table_id: number | string,
	dispatchTables: (value: action) => void
) => {
	axios
		.get<ResponseType>(`/tables/${table_id}/tasks`, auth.getAuthHeaders())
		.then((results) => {
			const data = results.data.message as TaskData[];
			if (data.length > 0) {
				dispatchTables({
					id: table_id,
					method: "ReplaceTasks",
					tasks: data,
				} as action);
			}
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default get_tasks;
