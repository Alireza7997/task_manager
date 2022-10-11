// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorRepeatedly } from "./utils/catch_error";

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
): (() => void) => {
	const address = backend + `/tasks/${table_id}`;

	return () => {
		axios
			.get<TaskResponse[]>(address)
			.then((results) => {
				setTables({
					id: id,
					tasks: results.data
				});
			})
			.catch((reason: Error | AxiosError) => {
				CatchErrorRepeatedly(tasks(backend, id, table_id, setTables), reason);
			});
	};
};

export default tasks;
