// =============== Libraries =============== //
import Router from "next/router";
import { FC, useContext } from "react";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

const Home: FC = () => {
	const auth = useContext(AuthContext);
	if (typeof window !== "undefined") {
		if (auth.is_authenticated) {
			Router.push("/me");
		} else {
			Router.push("/login");
		}
	}
	return <div></div>;
};

export default Home;
