import { createPortal } from "react-dom";
import styles from "./Squares.module.css"

const Squares = () => {
    return createPortal(<div className={styles["square-container"]}>
    <div className={styles.square}></div>
    <div className={styles.square}></div>
    <div className={styles.square}></div>
    <div className={styles.square}></div>
    <div className={styles.square}></div>
    <div className={styles.square}></div>
</div>, document.getElementById("squares") as HTMLElement);
}

export default Squares;