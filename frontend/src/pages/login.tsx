import Link from "next/link";
import styles from "../styles/pages/login-register.module.css";
import GlassmorphismForm from "../components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "../components/UI/InputGlassmorphismForm";
import Head from "next/head";

const Login: React.FC = () => {
	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<GlassmorphismForm>
				<h3>welcome</h3>
				<InputGlassmorphismForm
					id="username"
					label="username"
					placeHolder="email or username"
					type="text"
				/>
				<InputGlassmorphismForm
					id="password"
					label="password"
					placeHolder="password"
					type="password"
				/>
				<div>
					<InputGlassmorphismForm
						label="login"
						type="button"
						id=""
						placeHolder=""
					/>
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
