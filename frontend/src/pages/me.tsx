// =============== Libraries =============== //
import Head from "next/head";
import moment from "moment";
import React, { useContext, useEffect, useRef } from "react";

// =============== Utils =============== //
import createNotification from "@/notification/notifier";

// =============== Components =============== //
import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "@/components/UI/InputGlassmorphismForm";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== API =============== //
import update_me from "@/api/update_me";

const Me: React.FC = () => {
	const auth = useContext(AuthContext);
	const usernameRef = useRef<HTMLInputElement>();
	const emailRef = useRef<HTMLInputElement>();
	const passwordRef = useRef<HTMLInputElement>();

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

		createNotification(400, "Still Work In Progress Bitch", "Nope...", 0);
		// update_me(
		// 	globals.backend,
		// 	{
		// 		username: usernameRef.current?.value ? usernameRef.current?.value : "",
		// 		email: emailRef.current?.value ? emailRef.current?.value : "",
		// 		password: passwordRef.current?.value ? passwordRef.current?.value : "",
		// 	},
		// 	auth.setUser
		// );
	};

	return (
		<>
			<Head>
				<title>Me</title>
			</Head>
			<GlassmorphismForm
				addSquares={true}
				onSubmit={onMeSubmit}
				className="bg-slate-300"
			>
				<h3>Me</h3>
				<InputGlassmorphismForm
					id="username"
					label="username"
					type="text"
					className="bg-gray-400"
					reff={usernameRef}
				/>
				<InputGlassmorphismForm
					id="email"
					label="email"
					type="email"
					className="bg-gray-400"
					reff={emailRef}
					readonly={true}
				/>
				<InputGlassmorphismForm
					id="created_at"
					label="joined in"
					type="date"
					className="bg-gray-400"
					value={moment(auth.user?.created_at).format("YYYY-MM-DD")}
					readonly={true}
				/>
				<InputGlassmorphismForm
					id="password"
					label="password"
					type="password"
					className="bg-gray-400"
					reff={passwordRef}
				/>
				<InputGlassmorphismForm label="submit" type="button" id="submit" />
			</GlassmorphismForm>
		</>
	);
};

export default Me;
