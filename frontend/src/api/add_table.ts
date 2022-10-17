// =============== Libraries =============== //
import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";
import { TableResponse } from "./tables";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error"

const add_table = (backend: string, data: Record<string, string>, setTables: Dispatch<SetStateAction<TableResponse[]>>) => {
    const address = backend + `/tables`;

    axios
        .post<TableResponse>(address, data)
        .then((results) => {
            setTables((prev) => [...prev, results.data])
        })
        .catch((reason: Error | AxiosError) => {
            CatchErrorWithoutRepeat(reason)
        });
}

export default add_table;