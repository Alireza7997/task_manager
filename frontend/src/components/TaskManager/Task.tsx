// =============== Styles =============== //
import styles from "@/styles/TaskManager/Task.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Libraries =============== //
import { useContext, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Draggable } from "react-beautiful-dnd";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation } from "react-query";

// =============== Components =============== //
import { InputGlassmorphismFormProps } from "../UI/InputGlassmorphismForm";
import Popup from "./Popup";

// =============== Utils =============== //
import axios from "@/api/axios";

// =============== Types =============== //
import { action, TableData, TaskData } from "@/types/task_manager";
import ResponseType from "@/types/response";

// =============== API =============== //
import useDeleteTask from "@/api/use_delete_task";

interface TaskIconProps extends React.PropsWithChildren {
	onClick?: () => void;
	className?: string;
}

const TaskIcon = (props: TaskIconProps) => {
	return (
		<button
			onClick={props.onClick}
			className={`${styles["button-icon"]} ${props.className} first:ml-0 ml-1 taskButton`}
		>
			{props.children}
		</button>
	);
};

interface TaskProps extends React.PropsWithChildren {
	task: TaskData;
	table: TableData;
	index: number;
	dispatchTables: (value: action) => void;
}

const Task: React.FC<TaskProps> = (props: TaskProps) => {
	const auth = useContext(AuthContext);
	const [showEditPopup, setShowEditPopup] = useState(false);
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [taskFields, setTaskFields] = useState<TaskData | null>(null);
	const taskDelete = useDeleteTask(props.task.id, auth.getAuthHeaders());

	const { mutate: mutatePut } = useMutation((task: TaskData) =>
		axios
			.put<ResponseType>(`/tasks/${task.id}`, task, auth.getAuthHeaders())
			.then((value) => {
				const data = value.data.message as TaskData;
				props.dispatchTables({
					id: props.table.id,
					task_id: task.id,
					method: "ReplaceTask",
					tasks: [data],
				} as action);
			})
	);

	const editInputs: InputGlassmorphismFormProps[] = [
		{
			label: "name",
			type: "text",
			value: taskFields?.name,
			onChange: (e) => {
				setTaskFields((prev) => {
					return { ...prev!, name: e.target.value };
				});
			},
		},
		{
			id: "description",
			label: "description",
			type: "text",
			value: taskFields?.description,
			onChange: (e) => {
				setTaskFields((prev) => {
					return { ...prev!, description: e.target.value };
				});
			},
		},
	];

	const editButtons: InputGlassmorphismFormProps[] = [
		{
			label: "submit",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				mutatePut(taskFields!);
				setTaskFields(null);
				setShowEditPopup(false);
			},
		},
		{
			label: "cancel",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				setTaskFields(null);
				setShowEditPopup(false);
			},
		},
	];

	const deleteButtons: InputGlassmorphismFormProps[] = [
		{
			id: "delete",
			label: "delete",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				taskDelete.mutateAsync().then(() =>
					props.dispatchTables({
						id: props.table.id,
						method: "DeleteTask",
						task_id: props.task.id,
					} as action)
				);
				setShowDeletePopup(false);
			},
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				setShowDeletePopup(false);
			},
		},
	];

	return (
		<>
			{showEditPopup && (
				<Popup
					addSquares={false}
					title="Edit Task"
					inputs={editInputs}
					buttons={editButtons}
					hide={() => {
						setShowEditPopup(false);
						setTaskFields(null);
					}}
				/>
			)}
			{showDeletePopup && (
				<Popup
					addSquares={false}
					title={`Delete ${props.task.name}?`}
					inputs={[]}
					buttons={deleteButtons}
					hide={() => {
						setShowDeletePopup(false);
					}}
				/>
			)}
			<Draggable draggableId={props.task.id.toString()} index={props.index}>
				{(provided, snapshot) => (
					<div
						className={`${styles["task-row"]} ${
							snapshot.isDragging ? styles["task-row-active"] : ""
						}`}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.innerRef}
					>
						<div className="flex items-center">
							<h5 className={styles["task-title"]}>{props.task.name}</h5>
							<TaskIcon
								onClick={() => {
									setShowDeletePopup(true);
								}}
								className="bg-[#c04d4d]"
							>
								<DeleteForeverIcon className="w-5 h-5" htmlColor="#e6e6e6" />
							</TaskIcon>
							<TaskIcon
								onClick={() => {
									setShowEditPopup(true);
									setTaskFields(props.task);
								}}
								className="bg-[#4C70FF]"
							>
								<EditIcon className="w-5 h-5" htmlColor="#e6e6e6" />
							</TaskIcon>
						</div>
						<p className={styles["task-description"]}>
							{props.task.description}
						</p>
					</div>
				)}
			</Draggable>
		</>
	);
};

export default Task;
