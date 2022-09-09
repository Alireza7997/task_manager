import { AuthContext } from "@/store/auth";
import type { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { useContext } from "react";

const Home: NextPage = () => {
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
