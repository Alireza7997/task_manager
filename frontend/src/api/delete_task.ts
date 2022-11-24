// =============== Libraries =============== //
import { AxiosError } from "axios";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import { action } from "@/types/task_manager";
import Auth from "@/types/auth";

const delete_task = (
	auth: Auth,
	id: number | string,
	table_id: number | string,
	dispatchTables: (value: action) => void
) => {
	axios
		.delete(`/tasks/${id}`, auth.getAuthHeaders())
		.then(() => {
			dispatchTables({
				id: table_id,
				task_id: id,
				method: "DeleteTask",
			} as action);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default delete_task;
