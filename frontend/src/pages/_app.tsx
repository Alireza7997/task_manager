// =============== Styles =============== //
import "../styles/globals.css";
import "react-notifications-component/dist/theme.css";

// =============== Libraries =============== //
import { useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactNotifications } from "react-notifications-component";

// =============== Components =============== //
import { DashboardLayoutProps } from "@/components/Dashboard/DashboardLayout";

// =============== Stores =============== //
import AuthProvider from "@/store/auth";

type ComponentWithPageLayout = AppProps & {
	Component: AppProps["Component"] & {
		DashboardLayout?: React.ComponentType<DashboardLayoutProps>;
	};
};

function MyApp({ Component, pageProps }: ComponentWithPageLayout) {
	const [fullDashboard, setFullDashboard] = useState(false);

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
					<Component.DashboardLayout
						fullDashboard={fullDashboard}
						setFullDashboard={setFullDashboard}
					>
						<Component
							{...pageProps}
							fullDashboard={fullDashboard}
							setFullDashboard={setFullDashboard}
						/>
					</Component.DashboardLayout>
				) : (
					<Component {...pageProps} />
				)}
			</AuthProvider>
		</>
	);
}

export default MyApp;
