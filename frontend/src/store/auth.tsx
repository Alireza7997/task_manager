// =============== Libraries =============== //
import React, { createContext, useEffect, useState } from "react";
import Router from "next/router";

// =============== Types =============== //
import UserType from "@/types/user";
import AuthType from "@/types/auth";

export const AuthContext = createContext({
	is_authenticated: false,
} as AuthType);

const AuthProvider: React.FC<React.PropsWithChildren> = (props) => {
	const [sessionID, setSessionID] = useState("");
	const [accessToken, setAccessToken] = useState("");
	const [refreshToken, setRefreshToken] = useState("");
	const [user, setUser] = useState<UserType | null>(null);

	const auth = new AuthType(sessionID, accessToken, refreshToken, user, {
		setAccessToken: setAccessToken,
		setRefreshToken: setRefreshToken,
		setSessionID: setSessionID,
		setUser: setUser,
	});

	useEffect(() => {
		let accessTokenTemp =
			localStorage.getItem("accessToken") !== null
				? localStorage.getItem("accessToken")!
				: "";
		let refreshTokenTemp =
			localStorage.getItem("refreshToken") !== null
				? localStorage.getItem("refreshToken")!
				: "";
		let sessionIDTemp =
			localStorage.getItem("sessionID") !== null
				? localStorage.getItem("sessionID")!
				: "";
		setAccessToken(accessTokenTemp);
		setRefreshToken(refreshTokenTemp);
		setSessionID(sessionIDTemp);

		// Route Pushing
		if (accessTokenTemp.length === 0 && sessionIDTemp.length === 0) {
			if (Router.pathname !== "/login" && Router.pathname !== "/register")
				Router.push("/login");
		} else {
			if (Router.pathname === "/login" || Router.pathname === "/register")
				Router.push("/dashboard");
		}
	}, []);

	return (
		<AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
	);
};

export default AuthProvider;
