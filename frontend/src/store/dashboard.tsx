// =============== Libraries =============== //
import { createContext, useEffect, useState } from "react";
import TableChartIcon from "@mui/icons-material/TableChart";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Router from "next/router";

type pageOptions = "dashboard" | "task manager" | "profile";
const listIcons: Record<string, React.ReactNode> = {
	dashboard: <DashboardIcon key="1" className="mr-3" />,
	"task manager": <TableChartIcon key="2" className="mr-3" />,
	profile: <AccountBoxIcon key="3" className="mr-3" />,
};

interface contextValue {
	selectedOption: pageOptions;
	setSelectedOption: (
		value: ((prev: pageOptions) => pageOptions) | pageOptions
	) => void;
	fullDashboard: boolean;
	setFullDashboard: (value: ((prev: boolean) => boolean) | boolean) => void;
	listIcons: Record<string, React.ReactNode>;
	list: pageOptions[];
}

export const DashboardContext = createContext({} as contextValue);

const DashboardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [selectedOption, setSelectedOption] = useState<pageOptions | null>(
		null
	);
	const [fullDashboard, setFullDashboard] = useState(false);

	const pathName = typeof window !== "undefined" ? Router.pathname : "";
	useEffect(() => {
		const name = pathName.split("/")[1];
		const nameWithSpace = name.replaceAll("_", " ");
		if (listIcons[nameWithSpace] !== undefined) {
			const path = "/" + name;
			if (selectedOption !== nameWithSpace)
				setSelectedOption(nameWithSpace as pageOptions);
			if (!pathName.includes(path)) Router.push(path);
		}
	}, [pathName]);

	const value = {
		selectedOption: selectedOption,
		setSelectedOption: setSelectedOption,
		fullDashboard: fullDashboard,
		setFullDashboard: setFullDashboard,
		listIcons: listIcons,
		list: Object.keys(listIcons),
	} as contextValue;

	return (
		<DashboardContext.Provider value={value}>
			{children}
		</DashboardContext.Provider>
	);
};

export default DashboardProvider;
