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

export interface task {
	id: number;
	tasks: TaskResponse[];
}

const tasks = (
    backend: string,
	id: number,
	table_id: string | number,
	setTables: (value: task) => void
) => {
	const address = backend + `/tasks/${table_id}`;

	axios
		.get<TaskResponse[]>(address)
		.then((results) => {
			setTables({
				id: id,
				tasks: results.data
			});
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default tasks;
