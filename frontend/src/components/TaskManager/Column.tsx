// =============== Styles =============== //
import styles from "@/styles/TaskManager/Column.module.css";

// =============== Components =============== //
import Task from "@/components/TaskManager/Task";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/store/global";
import getTasks, { TaskResponse } from "@/api/tasks";

interface ColumnProps {
	id: number;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
}

const Column: React.FC<ColumnProps> = (props) => {
	const global = useContext(GlobalContext);
	const [tasks, setTasks] = useState<TaskResponse[]>([] as TaskResponse[]);
	useEffect(() => {
		getTasks(global.backend, props.id, setTasks)();
	}, []);

	return (
		<>
			<div className={styles["tasks-column"]}>
				<div className={styles["table-title"]}>
					<h4>{props.title}</h4>
				</div>

				<div className={styles["tasks"]}>
					{tasks.map((value) => {
						return (
							<Task
								key={value.id}
								name={value.name}
								description={value.description}
							/>
						);
					})}
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
