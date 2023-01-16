// =============== Styles =============== //
import styles from "@/styles/TaskManager/Task.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Libraries =============== //
import { useContext, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Draggable } from "react-beautiful-dnd";
import EditIcon from "@mui/icons-material/Edit";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import TimerIcon from "@mui/icons-material/Timer";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { parseISO } from "date-fns";

// =============== Components =============== //
import { InputGlassmorphismFormProps } from "../UI/InputGlassmorphismForm";
import Popup from "./Popup";

// =============== Types =============== //
import { action, TableData, TaskData } from "@/types/task_manager";

// =============== API =============== //
import useDeleteTask from "@/api/use_delete_task";
import usePutTask from "@/api/use_put_task";
import { Container } from "@mui/material";

interface TaskIconProps extends React.PropsWithChildren {
	onClick?: () => void;
	className?: string;
}

const TaskIcon = (props: TaskIconProps) => {
	return (
		<button
			onClick={props.onClick}
			className={`${styles["button-icon"]} ${props.className}`}
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
	const taskPut = usePutTask(
		props.table.id,
		auth.getAuthHeaders(),
		props.dispatchTables
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
			label: "description",
			type: "text",
			value: taskFields?.description,
			onChange: (e) => {
				setTaskFields((prev) => {
					return { ...prev!, description: e.target.value };
				});
			},
		},
		{
			label: "start date",
			type: "date",
			value: taskFields?.start_date,
			onChange: (e) => {
				setTaskFields((prev) => {
					return { ...prev!, start_date: e.target.value };
				});
			},
		},
		{
			label: "finish date",
			type: "date",
			value: taskFields?.finish_date,
			onChange: (e) => {
				setTaskFields((prev) => {
					return { ...prev!, finish_date: e.target.value };
				});
			},
		},
		{
			label: "due date",
			type: "date",
			value: taskFields?.due_date,
			onChange: (e) => {
				setTaskFields((prev) => {
					return { ...prev!, due_date: e.target.value };
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
				taskPut.mutate(taskFields!);
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

	const hours: number | null = props.task?.due_date
		? (Date.now() - parseISO(props.task?.due_date).getDate()) / 1000 / 60 / 60
		: null;
	const daysRemaining = hours && hours / 24;
	const hoursRemaining = hours && hours % 24;

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
							<h5
								className={`${styles["task-title"]} ${
									props.task.done && "line-through !text-gray-600"
								}`}
							>
								{props.task.name}
							</h5>
							{/* Icons */}
							<div className="space-y-1">
								<div className="flex flex-row-reverse space-x-reverse space-x-1">
									{/* Delete */}
									<TaskIcon
										onClick={() => {
											setShowEditPopup(true);
											setTaskFields(props.task);
										}}
										className="bg-[#4C70FF]"
									>
										<EditIcon className="w-5 h-5" htmlColor="#e6e6e6" />
									</TaskIcon>
									{/* Edit */}
									<TaskIcon
										onClick={() => {
											setShowDeletePopup(true);
										}}
										className="bg-[#c04d4d]"
									>
										<DeleteForeverIcon
											className="w-5 h-5"
											htmlColor="#e6e6e6"
										/>
									</TaskIcon>
								</div>
								<div className="flex flex-row-reverse space-x-reverse space-x-1">
									{/* Done */}
									<TaskIcon
										onClick={() => {
											taskPut.mutate({ ...props.task, done: !props.task.done });
										}}
										className={`${
											props.task.done ? "bg-[#1b721b]" : "bg-[#616161]"
										}`}
									>
										{props.task.done ? (
											<CheckBoxIcon className="w-5 h-5" htmlColor="#e6e6e6" />
										) : (
											<CheckBoxOutlineBlankIcon
												className="w-5 h-5"
												htmlColor="#e6e6e6"
											/>
										)}
									</TaskIcon>
									{/* Timer */}
									<Tooltip
										title={
											(daysRemaining !== null &&
												hoursRemaining !== null &&
												((daysRemaining > 0 &&
													hoursRemaining > 0 &&
													`${daysRemaining} days and ${hoursRemaining} hours remaining`) ||
													(daysRemaining <= 0 &&
														hoursRemaining <= 0 &&
														`${daysRemaining} days and ${hoursRemaining} hours passed`))) ||
											"OFF"
										}
										placement="bottom"
									>
										<Container className="!p-0">
											<TaskIcon
												className={`${
													props.task.done
														? "bg-[#1b721b]"
														: daysRemaining !== null && hoursRemaining !== null
														? daysRemaining! > 0 && hoursRemaining! > 0
															? "bg-[#72691b]"
															: daysRemaining! === 0 && hoursRemaining! > 0
															? "bg-[#723e1b]"
															: "bg-[#721b1b]"
														: "bg-[#616161]"
												}`}
											>
												<TimerIcon className="w-5 h-5" htmlColor="#e6e6e6" />
											</TaskIcon>
										</Container>
									</Tooltip>
								</div>
							</div>
							{/* End of Icons */}
						</div>
						<p
							className={`${styles["task-description"]} ${
								props.task.done && "line-through"
							}`}
						>
							{props.task.description}
						</p>
					</div>
				)}
			</Draggable>
		</>
	);
};

export default Task;
