// =============== Styles =============== //
import styles from "@/styles/pages/login-register.module.css";

// =============== Libraries =============== //
import Link from "next/link";
import Head from "next/head";
import React, { useRef, useState } from "react";

// =============== Components =============== //
import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "@/components/UI/InputGlassmorphismForm";

// =============== API =============== //
import register from "@/api/register";

const Register: React.FC = () => {
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const usernameRef = useRef<HTMLInputElement>();
	const emailRef = useRef<HTMLInputElement>();
	const passwordRef = useRef<HTMLInputElement>();

	const onRegisterSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const username = usernameRef.current?.value
			? usernameRef.current?.value
			: "";
		const email = emailRef.current?.value ? emailRef.current?.value : "";
		const password = passwordRef.current?.value
			? passwordRef.current?.value
			: "";

		register(setErrors, {
			username: username,
			email: email,
			password: password,
		});
	};

	return (
		<div className="bg-[#080710] h-screen">
			<Head>
				<title>Register</title>
			</Head>
			<GlassmorphismForm
				addSquares={true}
				onSubmit={onRegisterSubmit}
				className={"bg-[#ffffff21]"}
			>
				<h3>Register</h3>
				<InputGlassmorphismForm
					id="username"
					label="username"
					type="text"
					reff={usernameRef}
					errors={errors ? errors["Username"] : []}
				/>
				<InputGlassmorphismForm
					id="email"
					label="email"
					type="email"
					reff={emailRef}
					errors={errors ? errors["Email"] : []}
				/>
				<InputGlassmorphismForm
					id="password"
					label="password"
					type="password"
					reff={passwordRef}
					errors={errors ? errors["Password"] : []}
				/>
				<div>
					<InputGlassmorphismForm label="register" type="button" id="" />
					<div className={styles["not-signed-up-container"]}>
						<p>
							<Link href={"/login"}>login</Link>
						</p>
						<p>
							<Link href={"/login"}> </Link>
						</p>
					</div>
				</div>
			</GlassmorphismForm>
		</div>
	);
};

export default Register;
