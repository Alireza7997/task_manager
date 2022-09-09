// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== Utils =============== //
import { CatchErrorRepeatedly } from "./utils/catch_error"

function methods(setMethods: (value: string[]) => void): () => void {
    const address = process.env.NEXT_PUBLIC_BACKEND + "/auth/methods"
    return () => {
        axios
            .get<string[]>(address)
            .then((results) => {
                setMethods(results.data);
            })
            .catch((reason: Error | AxiosError) => {
                CatchErrorRepeatedly(methods(setMethods), reason)
            });
        }
    }

export default methods