import axios, { AxiosError } from "axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error"
import Router from "next/router";

interface loginResponse {
    username: string,
    email: string,
    created_at: Date
}

export interface loginRequest {
    username: string | undefined,
    password: string | undefined,
    method: string | undefined
}

function login(setErrors: (value: Record<string, string[]>) => void, data: loginRequest): () => void {
    const address = process.env.NEXT_PUBLIC_BACKEND + "/auth/login"
    return () => {
        axios
            .post<loginResponse>(address, data)
            .then((results) => {
                Router.push("/me")
                // Add user data to a store
            })
            .catch((reason: Error | AxiosError) => {
                const data = CatchErrorWithoutRepeat(reason)
                if (data !== null) {
                    setErrors(data.errors)
                }
            });
        }
    }

export default login