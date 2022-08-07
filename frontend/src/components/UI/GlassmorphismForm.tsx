import React from "react";
import styles from "../../styles/UI/GlassmorphismForm.module.css";
import Squares from "./Squares";

const GlassmorphismForm: React.FC<React.PropsWithChildren> = (
	props: React.PropsWithChildren
) => {
	return (
		<Squares>
			<form className={styles["glassmorphism-form"]}>{props.children}</form>
		</Squares>
	);
};

export default GlassmorphismForm;
