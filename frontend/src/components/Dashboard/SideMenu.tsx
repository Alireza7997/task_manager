// =============== Libraries =============== //
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import TableChartIcon from "@mui/icons-material/TableChart";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

// =============== Components =============== //
import SideMenuUL from "./SideMenuUL";

const list = ["task manager", "profile"];
const listIcons = [
	<TableChartIcon className="mr-3" />,
	<AccountBoxIcon className="mr-3" />,
];

interface SideMenuProps {
	showDashboard: () => void;
}

const SideMenu: React.FC<SideMenuProps> = (props) => {
	const [activeList, setActiveList] = useState(list[0]);

	return (
		<div className="flex flex-col w-[335px] bg-[#2C3748] p-6 h-screen text-[#b3bac5]">
			<MenuIcon
				className="h-[30px] w-[30px] mt-3 mb-[40px] cursor-pointer"
				onClick={() => props.showDashboard()}
			/>

			<div className="flex mb-[25px]">
				<img
					src="/mafia.png"
					alt="profile pic"
					className="w-[100px] rounded-full"
				/>
				<div className="flex-grow flex flex-col ml-5 justify-center">
					<p className="font-bold text-[#d7deeb]">Mahmood Heidari</p>
					<p className="text-sm text-[#9fa5af]">Maktoobgar</p>
				</div>
			</div>

			<div className="h-[1px] bg-slate-100" />
			<div className="flex flex-col flex-grow">
				<ul className="space-y-2 flex-grow">
					{list.map((element, i) => (
						<SideMenuUL
							key={element}
							active={activeList === element}
							onClick={() => setActiveList(element)}
						>
							{listIcons[i]}
							{element}
						</SideMenuUL>
					))}
				</ul>
				<SideMenuUL
					active={false}
					color="error"
					onClick={() => {
						console.log("exit");
					}}
				>
					<ExitToAppIcon className="mr-3" />
					Logout
				</SideMenuUL>
			</div>
		</div>
	);
};

export default SideMenu;
