// =============== Styles =============== //
import styles from "@/styles/TaskManager/Column.module.css";

// =============== Components =============== //
import Task from "@/components/TaskManager/Task";
import { TaskResponse } from "@/api/tasks";
import { Droppable } from "react-beautiful-dnd";

interface ColumnProps {
	id: number;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
	tasks: TaskResponse[];
}

const Column: React.FC<ColumnProps> = (props) => {
	console.log("column tasks = ", props.tasks);
	return (
		<Droppable droppableId={props.id.toString()}>
			{(provided) => (
				<div
					className={styles["tasks-column"]}
					ref={provided.innerRef}
					{...provided.droppableProps}
				>
					<div className={styles["table-title"]}>
						<h4>{props.title}</h4>
					</div>

					<div className={styles["tasks"]}>
						{props.tasks.map((value, index) => {
							return (
								<Task
									key={value.id}
									id={value.id}
									index={index}
									name={value.name}
									description={value.description}
								/>
							);
						})}
						{provided.placeholder}
					</div>

					<div className={styles["table-buttons"]}>
						<button>add task</button>

						<button>delete table</button>
					</div>
				</div>
			)}
		</Droppable>
	);
};

export default Column;
