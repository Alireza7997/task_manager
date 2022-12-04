// =============== Components =============== //
import InputGlassmorphismForm from "@/components/UI/InputGlassmorphismForm";

interface SideMenuULProps extends React.PropsWithChildren {
	active: boolean;
	onClick: () => void;
	label: string;
	className?: string;
}

const SideMenuUL: React.FC<SideMenuULProps> = (props) => {
	return (
		<li className="first:mt-5">
			<InputGlassmorphismForm
				label={props.label}
				id={props.label}
				type="button"
				onClick={() => props.onClick()}
				className={`py-3 w-full flex justify-start shadow-none text-white ${
					props.active ? "bg-[#4C70FFFF]" : "bg-transparent"
				} ${props.className}`}
			>
				{props.children}
			</InputGlassmorphismForm>
		</li>
	);
};

export default SideMenuUL;
