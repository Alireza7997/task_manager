// =============== Libraries =============== //
import axios, { AxiosError } from "axios";
import { remove } from "lodash";
import { Dispatch, SetStateAction } from "react";
import { TaskResponse } from "./tasks";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error";

const delete_task = (
    backend: string,
	id: number | string,
	setTasks: Dispatch<SetStateAction<TaskResponse[]>>
) => {
	const address = backend + `/tasks/${id}`;

	axios
		.delete(address)
		.then(() => {
			setTasks((prev) => {
                return remove(prev, (value) => value.id !== id);
            });
		})
		.catch((reason: Error | AxiosError) => {
			CatchErrorWithoutRepeat(reason);
		});
};

export default delete_task;
