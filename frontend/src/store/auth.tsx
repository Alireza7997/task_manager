// =============== Libraries =============== //
import React, { createContext, useContext, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import Router from "next/router";
import { parseISO } from "date-fns";

// =============== API =============== //
import me from "@/api/me";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

export class User {
	public username: string;
	public email: string;
	public created_at: Date;
	constructor(username: string, email: string, created_at: string) {
		this.username = username;
		this.email = email;
		this.created_at = parseISO(created_at);
	}
}

export interface Auth {
	session_id: string;
	token: string;
	is_authenticated: boolean;
	user?: User;
	reset: () => void;
	authenticate: (session_id: string, token: string) => void;
	getAuthHeaders: () => AxiosRequestConfig;
	addUser: (user: User) => void;
}

export const AuthContext = createContext({ is_authenticated: false } as Auth);

const AuthProvider: React.FC<React.PropsWithChildren> = (
	props: React.PropsWithChildren
) => {
	const globals = useContext(GlobalContext);
	const [sessionID, setSessionID] = useState("");
	const [token, setToken] = useState("");
	const [user, setUser] = useState<User | undefined>(undefined);

	let session_temp = "";
	let token_temp: string | null = "";
	if (typeof window !== "undefined") {
		const s = localStorage.getItem("session_id");
		const t = localStorage.getItem("token");

		session_temp = s ? s : "";
		token_temp = t ? t : "";
	}

	// eslint-disable-next-line
	useEffect(() => {
		setSessionID(session_temp ? session_temp : "");
		setToken(token_temp ? token_temp : "");
	});

	const reset = () => {
		if (typeof window !== "undefined") {
			localStorage.setItem("session_id", "");
			localStorage.setItem("token", "");
		}
		setSessionID("");
		setToken("");
		setUser(undefined);
	};

	const authenticate = (session_id: string, token: string) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("session_id", session_id);
			localStorage.setItem("token", token);
		}
		setSessionID(session_id);
		setToken(token);
	};

	const addUser = (user: User) => {
		setUser(user);
	};

	const getAuthHeaders: () => AxiosRequestConfig = () => {
		return {
			headers: {
				session_id: sessionID,
				jwt: token,
			},
		};
	};

	const value = {
		session_id: session_temp,
		token: token_temp,
		is_authenticated: session_temp.length !== 0 || token_temp.length !== 0,
		user: user,
		reset: reset,
		authenticate: authenticate,
		addUser: addUser,
		getAuthHeaders: getAuthHeaders,
	} as Auth;

	useEffect(() => {
		if (
			!value.is_authenticated &&
			Router.pathname !== "/login" &&
			Router.pathname !== "/register"
		) {
			Router.push("/login");
		}
	});

	useEffect(() => {
		if (
			value.is_authenticated &&
			(Router.pathname === "/login" || Router.pathname === "/register")
		) {
			Router.push("/dashboard");
		}
	});

	useEffect(() => {
		if (sessionID.length !== 0 || token.length !== 0) {
			me(globals.backend, value)();
		}
		// eslint-disable-next-line
	}, [sessionID, token]);

	return (
		<AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
	);
};

export default AuthProvider;
