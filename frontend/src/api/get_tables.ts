// =============== Libraries =============== //
import { AxiosError } from "axios";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import { TableData, action } from "@/types/task_manager";
import ResponseType from "@/types/response";
import Auth from "@/types/auth";

const get_tables = (
	auth: Auth,
	project_id: string | number,
	dispatchTables: (value: action) => void
) => {
	axios
		.get<ResponseType>(`/projects/${project_id}/tables`, auth.getAuthHeaders())
		.then((results) => {
			const data = results.data.message as TableData[];
			dispatchTables({
				method: "Replace",
				tables: data,
			} as action);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default get_tables;
