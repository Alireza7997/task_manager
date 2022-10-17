// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

export interface TaskResponse {
	id: number;
	name: string;
	description: string;
	done: boolean
}

const tasks = (
    backend: string,
	table_id: number,
	setTables: (value: TaskResponse[]) => void
) => {
	const address = backend + `/tasks/${table_id}`;

	axios
		.get<TaskResponse[]>(address)
		.then((results) => {
			setTables(results.data);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default tasks;
