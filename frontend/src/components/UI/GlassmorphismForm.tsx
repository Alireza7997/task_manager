// =============== Components =============== //
import Squares from "./Squares";

interface GlassmorphismFormProps extends React.PropsWithChildren {
	addSquares: boolean;
	onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

const GlassmorphismForm: React.FC<GlassmorphismFormProps> = (
	props: GlassmorphismFormProps
) => {
	const border = "border-2 border-solid border-[#08071099]";
	const style = "backdrop-blur-md rounded-xl w-[400px] bg-[#ffffff21] z-0";
	const center = "absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2";
	const centerItems = "flex flex-col justify-center space-y-8";
	const mediaQuery = "xsMax:w-screen xsMax:h-screen";
	return (
		<Squares addSquares={props.addSquares}>
			<form
				className={`${centerItems} ${center} ${style} ${border} ${mediaQuery}`}
				onSubmit={props.onSubmit}
			>
				{props.children}
			</form>
		</Squares>
	);
};

export default GlassmorphismForm;
