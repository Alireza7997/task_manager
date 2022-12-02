// =============== Libraries =============== //
import { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";

// =============== Store =============== //
import { DashboardContext } from "@/store/dashboard";

interface DashboardContainerProps extends React.PropsWithChildren {
	title: string;
}

const DashboardContainer = (props: DashboardContainerProps) => {
	const dashboard = useContext(DashboardContext);

	return (
		<div
			className={`bg-[#2C3748] flex-grow z-10 transition-all mdMax:p-0 ${
				dashboard.fullDashboard ? "p-0" : "p-[20px]"
			}`}
		>
			<div
				className={`bg-[#343442] h-full shadow-[0_0_30px_#0000004f] p-6 transition-all mdMax:rounded-none ${
					dashboard.fullDashboard ? "rounded-none" : "rounded-3xl"
				}`}
			>
				<div className="flex flex-col">
					<div className="flex">
						<MenuIcon
							className="h-[30px] w-[30px] mt-3 mb-[40px] cursor-pointer"
							onClick={() => {
								dashboard.setFullDashboard((prev) => !prev);
							}}
						/>
						<h2 className="capitalize font-bold text-3xl ml-8 mt-2">
							{props.title}
						</h2>
					</div>
					{props.children}
				</div>
			</div>
		</div>
	);
};

export default DashboardContainer;
