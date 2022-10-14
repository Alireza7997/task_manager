// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

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
) => {
	const address = backend + `/tables/${project_id}`;

	axios
		.get<TableResponse[]>(address)
		.then((results) => {
			setTables(results.data);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default tables;
