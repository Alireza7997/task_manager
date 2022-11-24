// =============== Libraries =============== //
import { AxiosError } from "axios";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import { TableData, action } from "@/types/task_manager";
import Auth from "@/types/auth";
import ResponseType from "@/types/response";

const add_table = (
	auth: Auth,
	data: Record<string, string>,
	project_id: number | string,
	dispatchTables: (value: action) => void
) => {
	axios
		.post<ResponseType>(
			`/projects/${project_id}/tables`,
			data,
			auth.getAuthHeaders()
		)
		.then((results) => {
			const data = results.data.message as TableData;
			dispatchTables({ method: "Add", tables: [data] } as action);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default add_table;
