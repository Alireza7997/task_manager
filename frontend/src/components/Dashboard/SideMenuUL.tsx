// =============== Libraries =============== //
import Button from "@mui/material/Button";

interface SideMenuULProps extends React.PropsWithChildren {
	active: boolean;
	color?:
		| "inherit"
		| "primary"
		| "secondary"
		| "success"
		| "error"
		| "info"
		| "warning";
	onClick: () => void;
}

const SideMenuUL: React.FC<SideMenuULProps> = (props) => {
	return (
		<li className="first:mt-5">
			<Button
				variant="contained"
				onClick={() => props.onClick()}
				className={`py-3 w-full flex justify-start shadow-none ${
					props.active && "bg-[#4C70FF]"
				}`}
				color={props.color}
			>
				{props.children}
			</Button>
		</li>
	);
};

export default SideMenuUL;
