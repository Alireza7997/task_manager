// =============== Styles =============== //
import styles from "@/styles/TaskManager/Task.module.css";

// =============== Libraries =============== //
import { Draggable } from "react-beautiful-dnd";

interface TaskProps extends React.PropsWithChildren {
	id: number;
	index: number;
	name: string;
	description: string;
}

const Task: React.FC<TaskProps> = (props: TaskProps) => {
	return (
		<Draggable draggableId={props.id.toString()} index={props.index}>
			{(provided) => (
				<div
					className={styles["task-row"]}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<h5 className={styles["task-title"]}>{props.name}</h5>
					<p className={styles["task-description"]}>{props.description}</p>
				</div>
			)}
		</Draggable>
	);
};

export default Task;
