// =============== Libraries =============== //
import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import Head from "next/head";

const Profile = () => {
	return (
		<>
			<Head>
				<title>Profile</title>
			</Head>
			<DashboardContainer title="Profile"></DashboardContainer>
		</>
	);
};

Profile.DashboardLayout = DashboardLayout;

export default Profile;
