// =============== Libraries =============== //
import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error"

// =============== Types =============== //
import { TableData, action } from "@/types/task_manager";

const add_table = (backend: string, data: Record<string, string>, dispatchTables: (value: action) => void) => {
    const address = backend + `/tables`;

    axios
        .post<TableData>(address, data)
        .then((results) => {
            dispatchTables({method: "Add", tables: [results.data]} as action)
        })
        .catch((reason: Error | AxiosError) => {
            CatchErrorWithoutRepeat(reason)
        });
}

export default add_table;