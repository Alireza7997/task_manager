// =============== Styles =============== //
import styles from "../styles/pages/login-register.module.css";

// =============== Libraries =============== //
import Link from "next/link";
import Head from "next/head";

// =============== Components =============== //
import GlassmorphismForm from "../components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "../components/UI/InputGlassmorphismForm";

const Me: React.FC = () => {
	return (
		<>
			<Head>
				<title>Me</title>
			</Head>
			<GlassmorphismForm addSquares={false}>
				<h3>Me</h3>
				<InputGlassmorphismForm id="username" label="username" type="text" />
				<InputGlassmorphismForm id="email" label="email" type="email" />
				<InputGlassmorphismForm id="created_at" label="joined in" type="date" />
				<InputGlassmorphismForm
					id="password"
					label="password"
					type="password"
				/>
				<div>
					<InputGlassmorphismForm label="submit" type="button" id="submit" />
					<div className={styles["not-signed-up-container"]}>
						<p>Logout</p>
						<p></p>
					</div>
				</div>
			</GlassmorphismForm>
		</>
	);
};

export default Me;
