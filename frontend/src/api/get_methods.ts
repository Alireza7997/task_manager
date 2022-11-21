// =============== Libraries =============== //
import { AxiosError } from "axios";

// =============== Utils =============== //
import axios from "./axios";
import { CatchErrorRepeatedly } from "./utils/catch_error";

// =============== Types =============== //
import ResponseType from "@/types/response";

function get_methods(setMethods: (value: string[]) => void): () => void {
	return () => {
		axios
			.get<ResponseType>("/auth/methods")
			.then((results) => {
				const data = results.data.message as string[];
				setMethods(data);
			})
			.catch((reason: Error | AxiosError) => {
				CatchErrorRepeatedly(get_methods(setMethods), reason);
			});
	};
}

export default get_methods;
