// =============== Styles =============== //
import styles from "@/styles/TaskManager/Table.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Libraries =============== //
import { useContext, useEffect, useState } from "react";

// =============== API =============== //
import delete_table from "@/api/delete_table";
import add_task from "@/api/add_task";

// =============== Components =============== //
import Task from "@/components/TaskManager/Task";
import Popup, { getInputValues } from "./Popup";
import { InputGlassmorphismFormProps } from "../UI/InputGlassmorphismForm";

// =============== Types =============== //
import { action, TaskData } from "@/types/task_manager";

interface TableProps {
	id: number | string;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
	tasks: TaskData[];
	dispatchTables: (value: action) => void;
	deleteTable: (id: number | string) => void;
}

const Table: React.FC<TableProps> = (props) => {
	const auth = useContext(AuthContext);
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [showAddPopup, setShowAddPopup] = useState(false);

	const deleteClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		delete_table(auth, props.id, props.deleteTable);
		setShowDeletePopup(false);
	};

	const addClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		const values = getInputValues(addInputs);
		add_task(auth, values, props.id, props.dispatchTables);
		setShowAddPopup(false);
	};

	const delButtons: InputGlassmorphismFormProps[] = [
		{
			id: "delete",
			label: "delete",
			type: "button",
			onClick: deleteClick,
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

	const addInputs: InputGlassmorphismFormProps[] = [
		{
			id: "name",
			label: "name",
			type: "text",
		},
		{
			id: "description",
			label: "description",
			type: "text",
		},
	];

	const addButtons: InputGlassmorphismFormProps[] = [
		{
			id: "add",
			label: "add",
			type: "button",
			onClick: addClick,
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				setShowAddPopup(false);
			},
		},
	];

	return (
		<>
			{showDeletePopup && (
				<Popup
					addSquares={false}
					title={`Delete "${props.title}"?`}
					inputs={[]}
					buttons={delButtons}
					hide={() => {
						setShowDeletePopup(false);
					}}
				/>
			)}
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
					<h4>{props.title}</h4>
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
								table_id={props.id}
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
							setShowDeletePopup(true);
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
