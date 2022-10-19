// =============== Libraries =============== //
import axios from "axios";
import Router from "next/router";

// =============== Utils =============== //
import createNotification from "@/notification/notifier";
import { CatchErrorWithoutRepeat } from "./utils/catch_error"

class RegisterRequestResponse {
    public username: string
    public email: string
    public password: string

    constructor(username: string, email: string, password: string) {
        this.username = username
        this.email = email
        this.password = password
    }
}

const register = (backend: string, setErrors: (value: Record<string, string[]>) => void, data: RegisterRequestResponse) => {
    const address = backend + `/auth/register`

    axios.post<RegisterRequestResponse>(address, data)
    .then(() => {
        createNotification(200, "Now try to log into your account.", "Register Succeed", 0)
        if (Router.pathname !== "/login") Router.push("/login")
    }).catch((reason) => {
        const data = CatchErrorWithoutRepeat(reason)
        if (data !== null) {
            setErrors(data?.errors)
        }
    })
}

export default register;