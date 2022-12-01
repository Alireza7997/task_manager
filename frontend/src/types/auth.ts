// =============== Libraries =============== //
import { AxiosRequestConfig } from "axios";
import Router from "next/router";

// =============== Types =============== //
import UserType from "./user";

// =============== Utilities =============== //
import createNotification from "@/notification/notifier";

// =============== API =============== //
import me from "@/api/me";
import refresh from "@/api/refresh";

interface setFunctions {
	setUser: (user: UserType | null) => void;
	setSessionID: (value: string) => void;
	setAccessToken: (value: string) => void;
	setRefreshToken: (value: string) => void;
}

export default class Auth {
	sessionID: string;
	accessToken: string;
	refreshToken: string;
	is_authenticated: boolean;
	user: UserType | null;

	setUser: (user: UserType | null) => void;
	setSessionID: (value: string) => void;
	setAccessToken: (value: string) => void;
	setRefreshToken: (value: string) => void;

	authenticate(sessionID: string, accessToken: string, refreshToken: string) {
		localStorage.setItem("sessionID", sessionID);
		localStorage.setItem("accessToken", accessToken);
		localStorage.setItem("refreshToken", refreshToken);
		this.setSessionID(sessionID);
		this.setAccessToken(accessToken);
		this.setRefreshToken(refreshToken);
		this.sessionID = sessionID;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		me(this)();
		Router.push("/dashboard");
	}

	refreshAccessRefreshToken(accessToken: string, refreshToken: string) {
		this.setAccessToken(accessToken);
		this.setRefreshToken(refreshToken);
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}

	resetAuth() {
		localStorage.setItem("sessionID", "");
		localStorage.setItem("accessToken", "");
		localStorage.setItem("refreshToken", "");
		this.setSessionID("");
		this.setAccessToken("");
		this.setRefreshToken("");
		this.setUser(null);
		this.sessionID = "";
		this.accessToken = "";
		this.refreshToken = "";
		this.user = null;
		Router.push("/login");
	}

	refreshJWT(operation: (auth: Auth) => void) {
		if (this.sessionID !== "") {
			createNotification(400, "Need to login again", "Session Expired", 0);
			Router.push("/login");
		} else if (this.accessToken !== "" && this.refreshToken !== "") {
			refresh({ token: this.accessToken }, this, operation)();
		}
	}

	buildAuthHeaders(sessionID: string, accessToken: string): AxiosRequestConfig {
		return {
			headers: {
				session_id: sessionID,
				jwt: accessToken,
			},
		};
	}

	getAuthHeaders(): AxiosRequestConfig {
		return this.buildAuthHeaders(this.sessionID, this.accessToken);
	}

	constructor(
		sessionID: string,
		accessToken: string,
		refreshToken: string,
		user: UserType | null,
		sets: setFunctions
	) {
		this.sessionID = sessionID;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.user = user;
		this.is_authenticated = sessionID.length !== 0 || accessToken.length !== 0;
		this.setAccessToken = sets.setAccessToken;
		this.setRefreshToken = sets.setRefreshToken;
		this.setSessionID = sets.setSessionID;
		this.setUser = sets.setUser;
	}
}
