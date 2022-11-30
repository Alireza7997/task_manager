// =============== Libraries =============== //
import Head from "next/head";
import Router from "next/router";
import { useContext } from "react";

// =============== Components =============== //
import GlassmorphismForm from "@/components/UI/GlassmorphismForm";
import InputGlassmorphismForm from "@/components/UI/InputGlassmorphismForm";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

const Logout: React.FC = () => {
	const auth = useContext(AuthContext);
	const onLogout = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		auth.resetAuth();
		if (Router.pathname !== "/login") Router.push("/login");
	};

	return (
		<>
			<Head>
				<title>Logout</title>
			</Head>
			<GlassmorphismForm
				addSquares={true}
				onSubmit={onLogout}
				className="bg-slate-300"
			>
				<h3>Are You Sure?</h3>
				<div className="space-y-[2px]">
					<InputGlassmorphismForm label="yes" type="button" id="yes" />
				</div>
			</GlassmorphismForm>
		</>
	);
};

export default Logout;
