// =============== Libraries =============== //
import { useContext } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Image from "next/image";
import Router from "next/router";

// =============== Components =============== //
import SideMenuUL from "./SideMenuUL";

// =============== Store =============== //
import { AuthContext } from "@/store/auth";
import { DashboardContext } from "@/store/dashboard";
import Modal from "../TaskManager/Modal";

const SideMenu: React.FC = () => {
	const auth = useContext(AuthContext);
	const dashboard = useContext(DashboardContext);

	return (
		<>
			{!dashboard.fullDashboard &&
				typeof window !== "undefined" &&
				window.innerWidth < 1280 && (
					<Modal
						hide={() => dashboard.setFullDashboard(true)}
						zIndex={40}
					></Modal>
				)}
			<div className="flex flex-col w-[335px] bg-[#2C3748] p-6 h-screen text-[#b3bac5]">
				<MenuIcon
					className="h-[30px] w-[30px] mt-3 mb-[40px] cursor-pointer"
					onClick={() => dashboard.setFullDashboard((prev) => !prev)}
				/>

				<div className="flex mb-[25px]">
					<div className="">
						<Image
							src="/mafia.png"
							alt="profile pic"
							className="rounded-full overflow-hidden max-h-[100px] max-w-[100px]"
							width={100}
							height={100}
						/>
					</div>
					<div className="flex-grow flex flex-col ml-5 justify-center overflow-hidden">
						<p className="font-bold text-[#d7deeb]">{auth.user?.username}</p>
						<p className="text-sm text-[#9fa5af] whitespace-normal">
							{auth.user?.email}
						</p>
					</div>
				</div>

				<div className="h-[1px] bg-slate-100" />
				<div className="flex flex-col flex-grow">
					<ul className="space-y-2 flex-grow">
						{dashboard.list.map((element, i) => (
							<SideMenuUL
								key={element}
								active={dashboard.selectedOption === element}
								onClick={() => {
									dashboard.setSelectedOption(element);
									Router.push("/" + element.replaceAll(" ", "_"));
								}}
							>
								{dashboard.listIcons[element]}
								{element}
							</SideMenuUL>
						))}
					</ul>
					<SideMenuUL
						active={false}
						color="error"
						onClick={() => auth.resetAuth()}
					>
						<ExitToAppIcon className="mr-3" />
						Logout
					</SideMenuUL>
				</div>
			</div>
		</>
	);
};

export default SideMenu;
