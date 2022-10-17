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
import Popup from "./Popup";
import { InputGlassmorphismFormProps } from "../UI/InputGlassmorphismForm";

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
	const [tasks, setTasks] = useState<TaskResponse[]>([]);
	useEffect(() => {
		getTasks(globals.backend, props.id, setTasks);
	}, []);

	const clickDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		delete_table(globals.backend, props.id, props.deleteTable);
		setShowDeletePopup(false);
	};

	const buttons: InputGlassmorphismFormProps[] = [
		{
			id: "delete",
			label: "delete",
			type: "button",
			onClick: clickDelete,
		},
	];
	return (
		<>
			{showDeletePopup && (
				<Popup
					addSquares={false}
					title={`Delete ${props.title}?`}
					inputs={[]}
					buttons={buttons}
					hide={() => {
						setShowDeletePopup(false);
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
					<button>add task</button>

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
