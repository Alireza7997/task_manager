// =============== Styles =============== //
import "../styles/globals.css";
import "react-notifications-component/dist/theme.css";

// =============== Libraries =============== //
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactNotifications } from "react-notifications-component";

// =============== Stores =============== //
import AuthProvider from "@/store/auth";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta
					name="description"
					content="Just a collaboration of maktoobgar and alireza"
				/>
			</Head>
			<ReactNotifications />
			<AuthProvider>
				<Component {...pageProps} />
			</AuthProvider>
		</>
	);
}

export default MyApp;
