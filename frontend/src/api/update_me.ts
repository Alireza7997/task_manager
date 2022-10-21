// =============== Libraries =============== //
import axios, { AxiosError } from "axios";

// =============== API =============== //
import { MeResponse } from "@/api/me";

// =============== Stores =============== //
import { User } from "@/store/auth";

// =============== Utils =============== //
import createNotification from "@/notification/notifier";
import { CatchErrorWithoutRepeat } from "./utils/catch_error"

const update_me = (backend: string, data: Record<string, string>, setUser: (user: User) => void) => {
    const address = backend + `/user/me`;

    axios
        .patch<MeResponse>(address, data)
        .then((results) => {
            setUser(new User(results.data.username, results.data.email, results.data.created_at))
            createNotification(200, "Profile Successfully updated", "Success", 0)
        })
        .catch((reason: Error | AxiosError) => {
            CatchErrorWithoutRepeat(reason)
        });
}

export default update_me;