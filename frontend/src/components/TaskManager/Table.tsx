// =============== Styles =============== //
import styles from "@/styles/TaskManager/Table.module.css";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

// =============== API =============== //
import getTasks, { task, TaskResponse } from "@/api/tasks";
import delete_table from "@/api/delete_table";

// =============== Libraries =============== //
import { Droppable } from "react-beautiful-dnd";
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
	tasks: TaskResponse[];
	deleteTable: (id: number) => void;
	dispatchTasks: (value: task) => void;
}

const Table: React.FC<TableProps> = (props) => {
	const globals = useContext(GlobalContext);
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	useEffect(() => {
		getTasks(globals.backend, props.id, props.dispatchTasks);
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
			<Droppable droppableId={props.id.toString()}>
				{(provided) => (
					<div
						className={styles["tasks-table"]}
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						<div className={styles["table-title"]}>
							<h4>{props.title}</h4>
						</div>

						<div className={styles["tasks"]}>
							{props.tasks.map((value, index) => {
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
							{provided.placeholder}
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
				)}
			</Droppable>
		</>
	);
};

export default Table;
