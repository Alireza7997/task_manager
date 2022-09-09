// =============== Styles =============== //
import styles from "@/styles/pages/login-register.module.css";

// =============== Libraries =============== //
import Head from "next/head";
import Router from "next/router";
import React, { useContext, useEffect } from "react";

// =============== Components =============== //
import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "@/components/UI/InputGlassmorphismForm";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

const Me: React.FC = () => {
	const auth = useContext(AuthContext);

	const onLogout = (event: React.MouseEvent) => {
		auth.reset();
		Router.push("/login");
	};

	return (
		<>
			<Head>
				<title>Me</title>
			</Head>
			<GlassmorphismForm addSquares={false}>
				<h3>Me</h3>
				<InputGlassmorphismForm
					id="username"
					label="username"
					type="text"
					value={auth.user?.username}
				/>
				<InputGlassmorphismForm
					id="email"
					label="email"
					type="email"
					value={auth.user?.email}
				/>
				<InputGlassmorphismForm
					id="created_at"
					label="joined in"
					type="date"
					value={auth.user?.created_at}
				/>
				<InputGlassmorphismForm
					id="password"
					label="password"
					type="password"
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
