// =============== Libraries =============== //
import { useContext } from "react";

// =============== Components =============== //
import SideMenu from "./SideMenu";

// =============== Store =============== //
import { DashboardContext } from "@/store/dashboard";

const DashboardLayout: React.FC<React.PropsWithChildren> = (props) => {
	const dashboard = useContext(DashboardContext);

	return (
		<div className="flex h-screen">
			{/* Invisible Div to on and off Side Menu visibility */}
			<div
				className={`transition-all mdMax:min-w-[0px] ${
					dashboard.fullDashboard ? "min-w-[0px]" : "min-w-[335px]"
				}`}
			></div>

			{/* Side Menu */}
			<div
				className={`fixed transition-all z-50 ${
					dashboard.fullDashboard ? "-left-[335px]" : "left-0"
				}`}
			>
				<SideMenu />
			</div>
			{props.children}
		</div>
	);
};

export default DashboardLayout;
