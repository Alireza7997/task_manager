// =============== Styles =============== //
import "../styles/globals.css";
import "react-notifications-component/dist/theme.css";

// =============== Libraries =============== //
import React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactNotifications } from "react-notifications-component";

// =============== Stores =============== //
import AuthProvider from "@/store/auth";
import DashboardProvider from "@/store/dashboard";

type ComponentWithPageLayout = AppProps & {
	Component: AppProps["Component"] & {
		DashboardLayout?: React.ComponentType<React.PropsWithChildren>;
	};
};

function MyApp({ Component, pageProps }: ComponentWithPageLayout) {
	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta
					name="description"
					content="Simple task manager created by maktoobgar and alireza"
				/>
			</Head>
			<ReactNotifications />
			<AuthProvider>
				{Component.DashboardLayout ? (
					<DashboardProvider>
						<Component.DashboardLayout>
							<Component {...pageProps} />
						</Component.DashboardLayout>
					</DashboardProvider>
				) : (
					<Component {...pageProps} />
				)}
			</AuthProvider>
		</>
	);
}

export default MyApp;
