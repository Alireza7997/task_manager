// =============== Styles =============== //
import styles from "@/styles/TaskManager/Task.module.css";

interface TaskProps extends React.PropsWithChildren {
	id: number | string;
	index: number;
	name: string;
	description: string;
}

const Task: React.FC<TaskProps> = (props: TaskProps) => {
	return (
		<div className={styles["task-row"]}>
			<h5 className={styles["task-title"]}>{props.name}</h5>
			<p className={styles["task-description"]}>{props.description}</p>
		</div>
	);
};

export default Task;
