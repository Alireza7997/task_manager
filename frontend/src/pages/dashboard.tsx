// =============== Libraries =============== //
import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Head from "next/head";

const Dashboard = () => {
	return (
		<>
			<Head>
				<title>Dashboard</title>
			</Head>
			<DashboardContainer title="Dashboard" />
		</>
	);
};

Dashboard.DashboardLayout = DashboardLayout;

export default Dashboard;
