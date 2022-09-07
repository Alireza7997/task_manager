import React, { createContext, useState } from "react";

export interface User {
	username: string;
	email: string;
	created_at: Date;
}

export interface Auth {
	session_id?: string;
	token?: string;
	is_authenticated: boolean;
	user?: User;
	reset: () => void;
	authenticate: (session_id: string, token: string) => void;
	addUser: (user: User) => void;
}

export const AuthContext = createContext({ is_authenticated: false } as Auth);

const AuthProvider: React.FC<React.PropsWithChildren> = (
	props: React.PropsWithChildren
) => {
	const [sessionID, setSessionID] = useState("");
	const [token, setToken] = useState("");
	const [user, setUser] = useState<User | undefined>(undefined);

	const reset = () => {
		setSessionID("");
		setToken("");
		setUser(undefined);
	};

	const authenticate = (session_id: string, token: string) => {
		setSessionID(session_id);
		setToken(token);
	};

	const addUser = (user: User) => {
		setUser(user);
	};

	return (
		<AuthContext.Provider
			value={
				{
					session_id: sessionID,
					token: token,
					is_authenticated: sessionID.length !== 0 || token.length !== 0,
					user: user,
					reset: reset,
					authenticate: authenticate,
					addUser: addUser,
				} as Auth
			}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
