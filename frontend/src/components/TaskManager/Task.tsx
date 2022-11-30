// =============== Styles =============== //
import styles from "@/styles/TaskManager/Task.module.css";

// =============== API =============== //
import delete_task from "@/api/delete_task";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Libraries =============== //
import { useContext } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// =============== Types =============== //
import { action } from "@/types/task_manager";

interface TaskProps extends React.PropsWithChildren {
	id: number | string;
	table_id: number | string;
	index: number;
	name: string;
	description: string;
	dispatchTables: (value: action) => void;
}

const Task: React.FC<TaskProps> = (props: TaskProps) => {
	const auth = useContext(AuthContext);

	return (
		<div className={styles["task-row"]}>
			<div className="flex items-center">
				<h5 className={styles["task-title"]}>{props.name}</h5>
				<button
					onClick={() => {
						delete_task(auth, props.id, props.table_id, props.dispatchTables);
					}}
					className={styles["button-icon"]}
				>
					<DeleteForeverIcon className="w-5 h-5" htmlColor="#e6e6e6" />
				</button>
			</div>
			<p className={styles["task-description"]}>{props.description}</p>
		</div>
	);
};

export default Task;
