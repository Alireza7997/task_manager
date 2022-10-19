// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorRepeatedly } from "./utils/catch_error"

function methods(backend: string, setMethods: (value: string[]) => void): () => void {
    const address = backend + `/auth/methods`

    return () => {
        axios
            .get<string[]>(address)
            .then((results) => {
                setMethods(results.data);
            })
            .catch((reason: Error | AxiosError) => {
                CatchErrorRepeatedly(methods(backend, setMethods), reason)
            });
        }
}

export default methods