// =============== Libraries =============== //
import { createContext, useEffect, useState } from "react";
import TableChartIcon from "@mui/icons-material/TableChart";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import Router from "next/router";

type pageOptions = "task manager" | "profile" | "";
const listIcons: Record<string, React.ReactNode> = {
	"task manager": <TableChartIcon key="1" className="mr-3" />,
	profile: <AccountBoxIcon key="2" className="mr-3" />,
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
	const [selectedOption, setSelectedOption] = useState<pageOptions>("");
	const [fullDashboard, setFullDashboard] = useState(false);

	useEffect(() => {
		const name = Router.pathname
			.replace("/dashboard", "")
			.replaceAll("?*", "")
			.replace("/", "")
			.replaceAll("_", " ");
		if (listIcons[name] !== undefined) {
			Router.push("/dashboard/" + name.replaceAll(" ", "_"));
			setSelectedOption(name as pageOptions);
		}
	}, []);

	useEffect(() => {
		if (selectedOption === "") return;
		Router.push("/dashboard/" + selectedOption.replaceAll(" ", "_"));
	}, [selectedOption]);

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
