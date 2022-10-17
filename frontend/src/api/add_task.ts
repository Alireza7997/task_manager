// =============== Libraries =============== //
import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { TaskResponse } from "./tasks";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error"

const add_task = (backend: string, data: Record<string, string>, setTasks: Dispatch<SetStateAction<TaskResponse[]>>) => {
    const address = backend + `/tasks`;

    axios
        .post<TaskResponse>(address, data)
        .then((results) => {
            setTasks((prev) => [...prev, results.data])
        })
        .catch((reason: Error | AxiosError) => {
            CatchErrorWithoutRepeat(reason)
        });
}

export default add_task;