import axios, { AxiosError } from "axios";
import { CatchErrorRepeatedly } from "./catch_error"

const Methods: (setMethods: (value: string[]) => void) => () => void = (setMethods: (value: string[]) => void) => {
    const address = process.env.NEXT_PUBLIC_BACKEND + "/auth/methods"
    return () => {
        axios
            .get<string[]>(address)
            .then((results) => {
                setMethods(results.data);
            })
            .catch((reason: Error | AxiosError) => {
                CatchErrorRepeatedly(Methods(setMethods), reason)
            });
        }
    }

export default Methods