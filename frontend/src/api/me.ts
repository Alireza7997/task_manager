import axios, { AxiosError } from "axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error"
import Router from "next/router";
import { User, Auth } from "@/store/auth";

function me(auth: Auth): () => void {
    const address = process.env.NEXT_PUBLIC_BACKEND + "/user/me"
    return () => {
        axios
            .get<User>(address, auth.getAuthHeaders())
            .then((results) => {
                const data = results.data as User
                auth.addUser(data)
            })
            .catch((reason: Error | AxiosError) => {
                const data = CatchErrorWithoutRepeat(reason)
                auth.reset()
                if (data !== null) {
                    Router.push("/login")
                }
            });
        }
    }

export default me