// =============== Components =============== //
import SideMenu from "./SideMenu";

export interface DashboardLayoutProps extends React.PropsWithChildren {
	fullDashboard: boolean;
	setFullDashboard: (value: (value: boolean) => boolean) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
	return (
		<div className="flex h-screen">
			{/* Invisible Div to on and off Side Menu visibility */}
			<div
				className={`transition-all mdMax:min-w-[0px] ${
					props.fullDashboard ? "min-w-[0px]" : "min-w-[335px]"
				}`}
			></div>

			{/* Side Menu */}
			<div
				className={`fixed transition-all z-50 ${
					props.fullDashboard ? "-left-[335px]" : "left-0"
				}`}
			>
				<SideMenu
					showDashboard={() => {
						props.setFullDashboard((prev) => !prev);
					}}
				/>
			</div>
			{props.children}
		</div>
	);
};

export default DashboardLayout;
