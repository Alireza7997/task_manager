import styles from "../../styles/UI/Squares.module.css";
import React from "react";

const Squares: React.FC<React.PropsWithChildren> = (
	props: React.PropsWithChildren
) => {
	return (
		<div className={styles["square-container"]}>
			<div className={styles.square}></div>
			<div className={styles.square}></div>
			<div className={styles.square}></div>
			<div className={styles.square}></div>
			<div className={styles.square}></div>
			<div className={styles.square}></div>
			{props.children}
		</div>
	);
};

export default Squares;
