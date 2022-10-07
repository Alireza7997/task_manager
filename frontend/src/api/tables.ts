// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorRepeatedly } from "./utils/catch_error";

export interface TableResponse {
	id: number;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
}

const tables = (
    backend: string,
	project_id: string | number,
	setTables: (value: TableResponse[]) => void
): (() => void) => {
	const address = backend + `/tables/${project_id}`;

	return () => {
		axios
			.get<TableResponse[]>(address)
			.then((results) => {
				setTables(results.data);
			})
			.catch((reason: Error | AxiosError) => {
				CatchErrorRepeatedly(tables(backend, project_id, setTables), reason);
			});
	};
};

export default tables;
