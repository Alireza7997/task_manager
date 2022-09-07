import axios, { AxiosError } from "axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error"
import Router from "next/router";
import { useContext } from "react";
import { AuthContext } from "@/store/auth";

interface loginResponse {
    token?: string
    session_id?: string
}

export interface loginRequest {
    username: string | undefined,
    password: string | undefined,
    method: string | undefined
}

const auth = useContext(AuthContext)

function login(setErrors: (value: Record<string, string[]>) => void, data: loginRequest): () => void {
    const address = process.env.NEXT_PUBLIC_BACKEND + "/auth/login"
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