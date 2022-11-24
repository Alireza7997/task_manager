// =============== Libraries =============== //
import { AxiosError } from "axios";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

// =============== Types =============== //
import Auth from "@/types/auth";

const delete_table = (
	auth: Auth,
	table_id: number | string,
	deleteTable: (id: number | string) => void
) => {
	axios
		.delete(`/tables/${table_id}`, auth.getAuthHeaders())
		.then(() => {
			deleteTable(table_id);
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default delete_table;
