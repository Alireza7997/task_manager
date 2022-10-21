// =============== Styles =============== //
import styles from "@/styles/TaskManager/Task.module.css";

// =============== API =============== //
import delete_task from "@/api/delete_task";
import { TaskResponse } from "@/api/tasks";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

// =============== Libraries =============== //
import { Dispatch, SetStateAction, useContext } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";

interface TaskProps extends React.PropsWithChildren {
	id: number | string;
	index: number;
	name: string;
	description: string;
	setTasks: Dispatch<SetStateAction<TaskResponse[]>>;
}

const Task: React.FC<TaskProps> = (props: TaskProps) => {
	const globals = useContext(GlobalContext);

	return (
		<div className={styles["task-row"]}>
			<div className="flex items-center">
				<h5 className={styles["task-title"]}>{props.name}</h5>
				<button
					onClick={() => {
						delete_task(globals.backend, props.id, props.setTasks);
					}}
					className={styles["button-icon"]}
				>
					<RiDeleteBin2Line className="w-5 h-5" color="#111111" />
				</button>
			</div>
			<p className={styles["task-description"]}>{props.description}</p>
		</div>
	);
};

export default Task;
