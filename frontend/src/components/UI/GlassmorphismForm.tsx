// =============== Styles =============== //
import styles from "@/styles/UI/GlassmorphismForm.module.css";

// =============== Components =============== //
import Squares from "./Squares";

interface GlassmorphismFormProps extends React.PropsWithChildren {
	addSquares: boolean;
	className?: string;
	onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

const GlassmorphismForm: React.FC<GlassmorphismFormProps> = (
	props: GlassmorphismFormProps
) => {
	return (
		<Squares addSquares={props.addSquares}>
			<form
				className={`${styles["glassmorphism-form"]} ${props.className}`}
				onSubmit={props.onSubmit}
			>
				{props.children}
			</form>
		</Squares>
	);
};

export default GlassmorphismForm;
