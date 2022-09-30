// =============== Styles =============== //
import styles from "@/styles/TaskManager/task.module.css";

interface TaskProps extends React.PropsWithChildren {
	title: string;
	description: string;
}

const Task: React.FC<TaskProps> = (props: TaskProps) => {
	return (
		<div className={styles["task-row"]} draggable="true">
			<h5 className={styles["task-title"]}>{props.title}</h5>
			<p className={styles["task-description"]}>{props.description}</p>
		</div>
	);
};

export default Task;
