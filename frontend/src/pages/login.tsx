// =============== Styles =============== //
import styles from "@/styles/pages/login-register.module.css";

// =============== Libraries =============== //
import Link from "next/link";
import Head from "next/head";
import React, { useContext, useEffect, useRef, useState } from "react";

// =============== Components =============== //
import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "@/components/UI/InputGlassmorphismForm";

// =============== API =============== //
import methods from "@/api/methods";
import login, { loginRequest } from "@/api/login";
import { AuthContext } from "@/store/auth";

const Login: React.FC = () => {
	const [methodsList, setMethods] = useState<string[]>([]);
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [method, setMethod] = useState<string>();
	const username = useRef<HTMLInputElement>();
	const password = useRef<HTMLInputElement>();
	const auth = useContext(AuthContext);
	useEffect(methods(setMethods), []);

	useEffect(() => {
		if (methodsList.length > 0) {
			setMethod(methodsList[0]);
		}
	}, [methodsList]);

	const onLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data: loginRequest = {
			username: username.current?.value,
			password: password.current?.value,
			method: method,
		};

		login(setErrors, data, auth)();
	};

	const onRadioButtonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMethod(event.target.value);
	};

	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<GlassmorphismForm addSquares={true} onSubmit={onLoginSubmit}>
				<h3>welcome</h3>
				<InputGlassmorphismForm
					id="username"
					label="username"
					type="text"
					errors={errors["Username"]}
					reff={username}
				/>
				<InputGlassmorphismForm
					id="password"
					label="password"
					type="password"
					errors={errors["Password"]}
					reff={password}
				/>
				<InputGlassmorphismForm
					label="method"
					type="radio"
					id="method"
					values={methodsList}
					default={methodsList[0]}
					errors={errors["Method"]}
					onRadioButtonChange={onRadioButtonChange}
				/>
				<div>
					<InputGlassmorphismForm label="login" type="button" id="" />
					<div className={styles["not-signed-up-container"]}>
						<p>
							<Link href={"/register"}>register</Link>
						</p>
						<p>
							<Link href={"/login"}>forgot password</Link>
						</p>
					</div>
				</div>
			</GlassmorphismForm>
		</>
	);
};

export default Login;
