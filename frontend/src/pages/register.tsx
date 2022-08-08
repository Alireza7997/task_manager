import React from "react";
import styles from "../styles/pages/login-register.module.css";
import GlassmorphismForm from "../components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "../components/UI/InputGlassmorphismForm";
import Link from "next/link";
import Head from "next/head";

const Register: React.FC = () => {
	return (
		<>
			<Head>
				<title>Register</title>
			</Head>
			<GlassmorphismForm>
				<h3>Register</h3>
				<InputGlassmorphismForm id="username" label="username" type="text" />
				<InputGlassmorphismForm id="email" label="email" type="email" />
				<InputGlassmorphismForm
					id="password"
					label="password"
					type="password"
				/>
				<div>
					<InputGlassmorphismForm
						label="register"
						type="button"
						id=""
						placeHolder=""
					/>
					<div className={styles["not-signed-up-container"]}>
						<p>
							<Link href={"/login"}>login</Link>
						</p>
						<p>
							<Link href={"/register"}>forgot password</Link>
						</p>
					</div>
				</div>
			</GlassmorphismForm>
		</>
	);
};

export default Register;
