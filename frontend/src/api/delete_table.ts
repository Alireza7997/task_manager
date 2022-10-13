// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

const delete_table = (
    backend: string,
	table_id: number,
	deleteTable: (id: number) => void
) => {
	const address = backend + `/tables/${table_id}`;

	axios
		.delete(address)
		.then(() => {
			deleteTable(table_id);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default delete_table;
