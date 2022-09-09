// =============== Styles =============== //
import styles from "@/styles/pages/login-register.module.css";

// =============== Libraries =============== //
import Head from "next/head";
import Router from "next/router";
import moment from "moment";
import React, { useContext, useEffect, useRef } from "react";

// =============== Components =============== //
import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "@/components/UI/InputGlassmorphismForm";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

const Me: React.FC = () => {
	const auth = useContext(AuthContext);
	const usernameRef = useRef<HTMLInputElement>();
	const emailRef = useRef<HTMLInputElement>();
	const passwordRef = useRef<HTMLInputElement>();

	const onLogout = (event: React.MouseEvent) => {
		auth.reset();
		Router.push("/login");
	};

	const storeUsername = auth.user?.username;
	const storeEmail = auth.user?.email;

	useEffect(() => {
		if (usernameRef.current) {
			usernameRef.current.value = storeUsername ? storeUsername : "";
		}
		if (emailRef.current) {
			emailRef.current.value = storeEmail ? storeEmail : "";
		}
	}, [storeUsername, storeEmail]);

	const onMeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<>
			<Head>
				<title>Me</title>
			</Head>
			<GlassmorphismForm addSquares={false} onSubmit={onMeSubmit}>
				<h3>Me</h3>
				<InputGlassmorphismForm
					id="username"
					label="username"
					type="text"
					reff={usernameRef}
				/>
				<InputGlassmorphismForm
					id="email"
					label="email"
					type="email"
					reff={emailRef}
				/>
				<InputGlassmorphismForm
					id="created_at"
					label="joined in"
					type="date"
					value={moment(auth.user?.created_at).format("YYYY-MM-DD")}
					readonly={true}
				/>
				<InputGlassmorphismForm
					id="password"
					label="password"
					type="password"
					reff={passwordRef}
				/>
				<div>
					<InputGlassmorphismForm label="submit" type="button" id="submit" />
					<div className={styles["not-signed-up-container"]}>
						<p onClick={onLogout}>Logout</p>
						<p></p>
					</div>
				</div>
			</GlassmorphismForm>
		</>
	);
};

export default Me;
