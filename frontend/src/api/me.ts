import axios, { AxiosError } from "axios";
import { CatchErrorWithoutRepeat } from "./utils/catch_error"
import Router from "next/router";
import { User, Auth } from "@/store/auth";

interface MeResponse {
	username: string;
	email: string;
	created_at: string;
}

function me(auth: Auth): () => void {
    const address = process.env.NEXT_PUBLIC_BACKEND + "/user/me"
    return () => {
        axios
            .get<MeResponse>(address, auth.getAuthHeaders())
            .then((results) => {
                const user: User = new User(results.data.username, results.data.email, results.data.created_at)
                auth.addUser(user)
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