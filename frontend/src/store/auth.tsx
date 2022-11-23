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
	const [sessionID, setSessionID] = useState(
		typeof window !== "undefined" && localStorage.getItem("SessionID") !== null
			? localStorage.getItem("SessionID")!
			: ""
	);
	const [accessToken, setAccessToken] = useState(
		typeof window !== "undefined" &&
			localStorage.getItem("AccessToken") !== null
			? localStorage.getItem("AccessToken")!
			: ""
	);
	const [refreshToken, setRefreshToken] = useState(
		typeof window !== "undefined" &&
			localStorage.getItem("RefreshToken") !== null
			? localStorage.getItem("RefreshToken")!
			: ""
	);
	const [user, setUser] = useState<UserType | null>(null);

	const auth = new AuthType(sessionID, accessToken, refreshToken, user, {
		setAccessToken: setAccessToken,
		setRefreshToken: setRefreshToken,
		setSessionID: setSessionID,
		setUser: setUser,
	});

	useEffect(() => {
		if (
			!auth.is_authenticated &&
			Router.pathname !== "/login" &&
			Router.pathname !== "/register"
		) {
			Router.push("/login");
		}
	});

	useEffect(() => {
		if (
			auth.is_authenticated &&
			(Router.pathname === "/login" || Router.pathname === "/register")
		) {
			Router.push("/dashboard");
		}
	});

	console.log(auth);
	console.log(auth.user);

	return (
		<AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
	);
};

export default AuthProvider;
