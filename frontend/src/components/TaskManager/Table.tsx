// =============== Styles =============== //
import styles from "@/styles/TaskManager/Table.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Libraries =============== //
import { useContext, useState } from "react";
import { useMutation } from "react-query";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";

// =============== Components =============== //
import Task from "@/components/TaskManager/Task";
import Popup, { getInputValues } from "./Popup";
import { InputGlassmorphismFormProps } from "../UI/InputGlassmorphismForm";

// =============== Utils =============== //
import axios from "@/api/axios";

// =============== Types =============== //
import { action, TableData, TaskData } from "@/types/task_manager";
import ResponseType from "@/types/response";

interface TableProps {
	table: TableData;
	tasks: TaskData[];
	dispatchTables: (value: action) => void;
	deleteTable: (value: TableData) => void;
}

const Table: React.FC<TableProps> = (props) => {
	const auth = useContext(AuthContext);
	const [addTaskFields, setAddTaskFields] = useState<{
		name: string;
		description: string;
	}>({ name: "", description: "" });
	const [tableFields, setTableFields] = useState<TableData | null>(null);
	const [showAddPopup, setShowAddPopup] = useState(false);
	const [showEditPopup, setShowEditPopup] = useState(false);
	const { mutateAsync: mutateAsyncAdd } = useMutation((id: number) =>
		axios
			.post<ResponseType>(
				`/tables/${id}/tasks`,
				addTaskFields,
				auth.getAuthHeaders()
			)
			.then((value) => value.data.message as TaskData)
	);

	const { mutate: mutatePut } = useMutation((table: TableData) =>
		axios
			.put<ResponseType>(`/tables/${table.id}`, table, auth.getAuthHeaders())
			.then((value) => {
				const data = value.data.message as TableData;
				props.dispatchTables({
					id: table.id,
					method: "ReplaceTable",
					tables: [data],
				} as action);
			})
	);

	const addInputs: InputGlassmorphismFormProps[] = [
		{
			id: "name",
			label: "name",
			type: "text",
			value: addTaskFields.name,
			onChange: (e) => {
				setAddTaskFields((prev) => {
					console.log(e.target.value);
					return { ...prev, name: e.target.value };
				});
			},
		},
		{
			id: "description",
			label: "description",
			type: "text",
			value: addTaskFields.description,
			onChange: (e) => {
				setAddTaskFields((prev) => {
					return { ...prev, description: e.target.value };
				});
			},
		},
	];

	const addButtons: InputGlassmorphismFormProps[] = [
		{
			id: "add",
			label: "add",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				mutateAsyncAdd(props.table.id).then((value) => {
					props.dispatchTables({
						id: props.table.id,
						method: "AddTask",
						tasks: [value],
					} as action);
				});
				setAddTaskFields({ name: "", description: "" });
				setShowAddPopup(false);
			},
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				setAddTaskFields({ name: "", description: "" });
				setShowAddPopup(false);
			},
		},
	];

	const editInputs: InputGlassmorphismFormProps[] = [
		{
			label: "title",
			type: "text",
			value: tableFields?.title,
			onChange: (e) => {
				setTableFields((prev) => {
					return { ...prev!, title: e.target.value };
				});
			},
		},
		{
			id: "description",
			label: "description",
			type: "text",
			value: tableFields?.description,
			onChange: (e) => {
				setTableFields((prev) => {
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
				mutatePut(tableFields!);
				setTableFields(null);
				setShowEditPopup(false);
			},
		},
		{
			label: "cancel",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				setTableFields(null);
				setShowEditPopup(false);
			},
		},
	];

	return (
		<>
			{showAddPopup && (
				<Popup
					addSquares={false}
					title="Add Task"
					inputs={addInputs}
					buttons={addButtons}
					hide={() => {
						setShowAddPopup(false);
					}}
				/>
			)}
			{showEditPopup && (
				<Popup
					addSquares={false}
					title="Edit Table"
					inputs={editInputs}
					buttons={editButtons}
					hide={() => {
						setShowEditPopup(false);
						setTableFields(null);
					}}
				/>
			)}
			<div className={styles["tasks-table"]}>
				<div className={styles["table-title"]}>
					<h4>{props.table.title}</h4>
				</div>

				<div className={styles["tasks"]}>
					{props.tasks.length === 0 && (
						<div className="p-3 ">
							<p className="text-center text-slate-200 font-bold">NO TASK</p>
						</div>
					)}
					{props.tasks.map((value, index) => {
						return (
							<Task
								key={value.id}
								index={index}
								dispatchTables={props.dispatchTables}
								task={value}
								table={props.table}
							/>
						);
					})}
				</div>

				<div className={styles["table-buttons"]}>
					<button
						className="p-2"
						onClick={() => {
							setShowAddPopup(true);
						}}
					>
						<AddCircleIcon className="h-[30px] w-[30px]" />
					</button>
					<button
						className="p-2"
						onClick={() => {
							setTableFields(props.table);
							setShowEditPopup(true);
						}}
					>
						<ModeEditIcon className="h-[30px] w-[30px]" />
					</button>
					<button
						className="p-2"
						onClick={() => {
							props.deleteTable(props.table);
						}}
					>
						<DeleteIcon className="h-[30px] w-[30px]" />
					</button>
				</div>
			</div>
		</>
	);
};

export default Table;
