// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import { TableData, action } from "@/types/task_manager";

const tables = (
	backend: string,
	project_id: string | number,
	dispatchTables: (value: action) => void
) => {
	const address = backend + `/projects/${project_id}/tables`;

	axios
		.get<TableData[]>(address)
		.then((results) => {
			dispatchTables({
				method: "Replace",
				tables: results.data,
			} as action);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default tables;
