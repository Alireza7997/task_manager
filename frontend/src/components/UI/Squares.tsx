// =============== Styles =============== //
import styles from "@/styles/UI/Squares.module.css";

interface SquaresProps extends React.PropsWithChildren {
	addSquares: boolean;
}

const Squares: React.FC<SquaresProps> = (props: SquaresProps) => {
	return (
		<>
			{props.addSquares && (
				<div className={styles["square-container"]}>
					{props.addSquares && (
						<>
							<div className={styles.square}></div>
							<div className={styles.square}></div>
							<div className={styles.square}></div>
							<div className={styles.square}></div>
							<div className={styles.square}></div>
							<div className={styles.square}></div>
						</>
					)}
					{props.children}
				</div>
			)}
			{!props.addSquares && props.children}
		</>
	);
};

export default Squares;
