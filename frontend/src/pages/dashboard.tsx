import dynamic from "next/dynamic";
const Admin = dynamic(() => import("@/admin/App"), { ssr: false });

const Dashboard: React.FC<React.PropsWithChildren> = (
	props: React.PropsWithChildren
) => {
	return <Admin />;
};

export default Dashboard;
