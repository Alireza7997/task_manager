// =============== Libraries =============== //
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

// =============== Components =============== //
import SideMenu from "@/components/Dashboard/SideMenu";

const Dashboard: React.FC<React.PropsWithChildren> = (
	props: React.PropsWithChildren
) => {
	const [fullDashboard, setFullDashboard] = useState(false);

	return (
		<div className="flex h-screen">
			<div
				className={`min-w-[335px] smMax:animate-fade_side ${
					fullDashboard ? "animate-fade_side" : "animate-fade_side_reverse"
				}`}
			></div>

			<div className="fixed">
				<SideMenu
					showDashboard={() => {
						setFullDashboard((prev) => !prev);
					}}
				/>
			</div>
			<div
				className={`bg-[#2C3748] flex-grow p-[20px] w-[500px] z-10 smMax:animate-fill ${
					fullDashboard ? "animate-fill" : "animate-fill_reverse"
				}`}
			>
				<div
					className={`bg-[#343442] h-full rounded-3xl shadow-[0_0_30px_#0000004f] p-6 smMax:animate-radius_loose ${
						fullDashboard
							? "animate-radius_loose"
							: "animate-radius_loose_reverse"
					}`}
				>
					<MenuIcon
						className="h-[30px] w-[30px] mt-3 mb-[40px] cursor-pointer"
						onClick={() => {
							setFullDashboard((prev) => !prev);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
