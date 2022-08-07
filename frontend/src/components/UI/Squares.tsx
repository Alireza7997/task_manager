import React from "react";
import { createPortal } from "react-dom";
import styles from "./Squares.module.css";

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
