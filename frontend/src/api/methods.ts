import axios from "axios";

const Methods: (setMethods: (value: string[]) => void) => () => void = (setMethods: (value: string[]) => void) => {
    return () => {
        axios
            .get<string[]>("http://127.0.0.1:9090/auth/methods")
            .then((results) => {
                setMethods(results.data);
            })
            .catch((reason) => {
                console.log(reason);
            });
        }
    }

export default Methods