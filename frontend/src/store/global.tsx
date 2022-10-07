import { createContext, useEffect } from "react";

export interface Globals {
	backend: string;
}

export const GlobalContext = createContext({} as Globals);

const GlobalProvider: React.FC<React.PropsWithChildren> = (
	props: React.PropsWithChildren
) => {
	const value = {
		backend: process.env.NEXT_PUBLIC_BACKEND
			? process.env.NEXT_PUBLIC_BACKEND
			: "http://127.0.0.1:5000",
	} as Globals;

	return (
		<GlobalContext.Provider value={value}>
			{props.children}
		</GlobalContext.Provider>
	);
};

export default GlobalProvider;
