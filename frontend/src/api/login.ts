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

interface loginRequest {
    username: string | undefined,
    password: string | undefined,
    method: string | undefined
}

const login = (backend: string, setErrors: (value: Record<string, string[]>) => void, data: loginRequest, auth: Auth) => {
    const address = backend + `/auth/login`

    axios
        .post<loginResponse>(address, data)
        .then((results) => {
            const data = results.data as loginResponse
            auth.authenticate(data.session_id? data.session_id: "", data.token? data.token: "")
            if (Router.pathname !== "/dashboard") Router.push("/dashboard")
        })
        .catch((reason: Error | AxiosError) => {
            const data = CatchErrorWithoutRepeat(reason)
            if (data !== null) {
                setErrors(data.errors)
            }
        });
}

export default login