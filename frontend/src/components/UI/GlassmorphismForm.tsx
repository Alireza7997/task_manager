import styles from "../../styles/UI/GlassmorphismForm.module.css";
import Squares from "./Squares";

interface GlassmorphismFormProps extends React.PropsWithChildren {
	addSquares: boolean;
}

const GlassmorphismForm: React.FC<GlassmorphismFormProps> = (
	props: GlassmorphismFormProps
) => {
	return (
		<Squares addSquares={props.addSquares}>
			<form className={styles["glassmorphism-form"]}>{props.children}</form>
		</Squares>
	);
};

export default GlassmorphismForm;
