// =============== Styles =============== //
import styles from "../styles/pages/login-register.module.css";

// =============== Libraries =============== //
import Link from "next/link";
import Head from "next/head";

// =============== Components =============== //
import GlassmorphismForm from "../components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "../components/UI/InputGlassmorphismForm";

const Login: React.FC = () => {
	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<GlassmorphismForm addSquares={true}>
				<h3>welcome</h3>
				<InputGlassmorphismForm id="username" label="username" type="text" />
				<InputGlassmorphismForm
					id="password"
					label="password"
					type="password"
				/>
				<InputGlassmorphismForm
					label="method"
					type="radio"
					id="method"
					values={["jwt", "session"]}
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
