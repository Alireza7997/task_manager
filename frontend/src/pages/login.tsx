// =============== Styles =============== //
import styles from "@/styles/pages/login-register.module.css";

// =============== Libraries =============== //
import Link from "next/link";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

// =============== Components =============== //
import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "@/components/UI/InputGlassmorphismForm";

// =============== API =============== //
import methods from "@/api/methods";
import login, { loginRequest } from "@/api/login";

const Login: React.FC = () => {
	const [methodsList, setMethods] = useState<string[]>([]);
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const username = useRef<HTMLInputElement>();
	const password = useRef<HTMLInputElement>();
	const method = useRef<HTMLInputElement>();
	useEffect(methods(setMethods), []);

	const onLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data: loginRequest = {
			username: username.current?.value,
			password: password.current?.value,
			method: method.current?.value,
		};

		login(setErrors, data)();
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
					reff={method}
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
