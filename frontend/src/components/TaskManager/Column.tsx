// =============== Styles =============== //
import styles from "@/styles/TaskManager/column.module.css";

// =============== Components =============== //
import Task from "@/components/TaskManager/Task";

const Column: React.FC = () => {
	return (
		<>
			<div className={styles["tasks-column"]}>
				<div className={styles["table-title"]}>
					<h4>Table Title</h4>
				</div>

				<div className={styles["tasks"]}>
					<Task title="title" description="description"></Task>
					<Task title="title" description="description"></Task>
					<Task title="title" description="description"></Task>
				</div>

				<div className={styles["table-buttons"]}>
					<button>add task</button>

					<button>delete table</button>
				</div>
			</div>
		</>
	);
};

export default Column;
