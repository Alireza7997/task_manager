// =============== Styles =============== //
import styles from "@/styles/TaskManager/Task.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Libraries =============== //
import { useContext } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useMutation } from "react-query";

// =============== Utils =============== //
import axios from "@/api/axios";

// =============== Types =============== //
import { action, TableData, TaskData } from "@/types/task_manager";
import ResponseType from "@/types/response";

interface TaskProps extends React.PropsWithChildren {
	task: TaskData;
	table: TableData;
	index: number;
	dispatchTables: (value: action) => void;
}

const Task: React.FC<TaskProps> = (props: TaskProps) => {
	const auth = useContext(AuthContext);
	const { mutateAsync: mutateAsyncDelete } = useMutation((id: number) =>
		axios.delete<ResponseType>(`/tasks/${id}`, auth.getAuthHeaders())
	);

	return (
		<div className={styles["task-row"]}>
			<div className="flex items-center">
				<h5 className={styles["task-title"]}>{props.task.name}</h5>
				<button
					onClick={() => {
						mutateAsyncDelete(props.task.id).then(() =>
							props.dispatchTables({
								id: props.table.id,
								method: "DeleteTask",
								task_id: props.task.id,
							} as action)
						);
					}}
					className={styles["button-icon"]}
				>
					<DeleteForeverIcon className="w-5 h-5" htmlColor="#e6e6e6" />
				</button>
			</div>
			<p className={styles["task-description"]}>{props.task.description}</p>
		</div>
	);
};

export default Task;
