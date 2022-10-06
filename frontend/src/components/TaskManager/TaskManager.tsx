// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Components =============== //
import Column from "./Column";

const TaskManager: React.FC = () => {
	return (
		<div className={styles["task-manager-container"]}>
			<Column />
			<Column />
			<Column />
			<div className={styles["add-table"]}>
				<button>+</button>
			</div>
		</div>
	);
};

export default TaskManager;
