// =============== Styles =============== //
import styles from "@/styles/UI/Squares.module.css";
import { useMemo } from "react";

interface SquaresProps extends React.PropsWithChildren {
	addSquares: boolean;
}

const LittleSquares: React.FC = () =>
	useMemo(
		() => (
			<>
				<div className={styles.square}></div>
				<div className={styles.square}></div>
				<div className={styles.square}></div>
				<div className={styles.square}></div>
				<div className={styles.square}></div>
				<div className={styles.square}></div>
			</>
		),
		[]
	);

const Squares: React.FC<SquaresProps> = (props: SquaresProps) => {
	return (
		<>
			{props.addSquares && (
				<div className={styles["square-container"]}>
					{props.addSquares && <LittleSquares />}
					{props.children}
				</div>
			)}
			{!props.addSquares && props.children}
		</>
	);
};

export default Squares;
