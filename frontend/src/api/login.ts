// =============== Libraries =============== //
import axios, { AxiosError } from "axios";
import Router from "next/router";

// =============== Utils =============== //
import { CatchErrorWithoutRepeat } from "./utils/catch_error"

// =============== Stores =============== //
import { Auth } from "@/store/auth";

interface loginResponse {
    token?: string
    session_id?: string
}

export interface loginRequest {
    username: string | undefined,
    password: string | undefined,
    method: string | undefined
}

const address = process.env.NEXT_PUBLIC_BACKEND + "/auth/login"

function login(setErrors: (value: Record<string, string[]>) => void, data: loginRequest, auth: Auth): () => void {
    return () => {
        axios
            .post<loginResponse>(address, data)
            .then((results) => {
                const data = results.data as loginResponse
                auth.authenticate(data.session_id? data.session_id: "", data.token? data.token: "")
                Router.push("/me")
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