// =============== Styles =============== //
import styles from "@/styles/TaskManager/Table.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Libraries =============== //
import { useContext, useState } from "react";
import { useMutation } from "react-query";

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
	const [addTaskFields, setAddTableFields] = useState<{
		name: string;
		description: string;
	}>({ name: "", description: "" });
	const [showAddPopup, setShowAddPopup] = useState(false);
	const { mutateAsync: mutateAsyncAdd } = useMutation((id: number) =>
		axios
			.post<ResponseType>(
				`/tables/${id}/tasks`,
				addTaskFields,
				auth.getAuthHeaders()
			)
			.then((value) => value.data.message as TaskData)
	);

	const addInputs: InputGlassmorphismFormProps[] = [
		{
			id: "name",
			label: "name",
			type: "text",
			value: addTaskFields.name,
			onChange: (e) => {
				setAddTableFields((prev) => {
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
				setAddTableFields((prev) => {
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
				setAddTableFields({ name: "", description: "" });
				setShowAddPopup(false);
			},
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				setAddTableFields({ name: "", description: "" });
				setShowAddPopup(false);
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
								id={value.id}
								index={index}
								name={value.name}
								description={value.description}
								dispatchTables={props.dispatchTables}
								table_id={props.table.id}
							/>
						);
					})}
				</div>

				<div className={styles["table-buttons"]}>
					<button
						onClick={() => {
							setShowAddPopup(true);
						}}
					>
						add task
					</button>

					<button
						onClick={() => {
							props.deleteTable(props.table);
						}}
					>
						delete table
					</button>
				</div>
			</div>
		</>
	);
};

export default Table;
