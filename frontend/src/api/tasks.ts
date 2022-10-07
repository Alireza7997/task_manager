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

const tasks = (
    backend: string,
	table_id: string | number,
	setTables: (value: TaskResponse[]) => void
): (() => void) => {
	const address = backend + `/tasks/${table_id}`;

	return () => {
		axios
			.get<TaskResponse[]>(address)
			.then((results) => {
				setTables(results.data);
			})
			.catch((reason: Error | AxiosError) => {
				CatchErrorRepeatedly(tasks(backend, table_id, setTables), reason);
			});
	};
};

export default tasks;
