// =============== Styles =============== //
import styles from "@/styles/TaskManager/Table.module.css";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

// =============== API =============== //
import getTasks, { TaskResponse } from "@/api/tasks";
import delete_table from "@/api/delete_table";

// =============== Libraries =============== //
import { useContext, useEffect, useState } from "react";

// =============== Components =============== //
import Task from "@/components/TaskManager/Task";
import Popup, { getInputValues } from "./Popup";
import { InputGlassmorphismFormProps } from "../UI/InputGlassmorphismForm";

// =============== API =============== //
import add_task from "@/api/add_task";

interface TableProps {
	id: number;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
	deleteTable: (id: number) => void;
}

const Table: React.FC<TableProps> = (props) => {
	const globals = useContext(GlobalContext);
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [showAddPopup, setShowAddPopup] = useState(false);
	const [tasks, setTasks] = useState<TaskResponse[]>([]);
	useEffect(() => {
		getTasks(globals.backend, props.id, setTasks);
	}, []);

	const deleteClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		delete_table(globals.backend, props.id, props.deleteTable);
		setShowDeletePopup(false);
	};

	const addClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		const values = getInputValues(addInputs);
		values["table_id"] = props.id.toString();
		add_task(globals.backend, values, setTasks);
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
					title={`Delete ${props.title}?`}
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
					title="Add Table"
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
					{tasks.map((value, index) => {
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
