// =============== Libraries =============== //
import axios, { AxiosError } from "axios";
import remove from "lodash/remove";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import { action } from "@/types/task_manager";

const delete_task = (
	backend: string,
	id: number | string,
	table_id: number | string,
	dispatchTables: (value: action) => void
) => {
	const address = backend + `/tasks/${id}`;

	axios
		.delete(address)
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
