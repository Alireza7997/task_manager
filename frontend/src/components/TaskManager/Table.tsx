// =============== Styles =============== //
import styles from "@/styles/TaskManager/Table.module.css";

// =============== Components =============== //
import Task from "@/components/TaskManager/Task";
import { TaskResponse } from "@/api/tasks";
import { Droppable } from "react-beautiful-dnd";
import { useContext, useState } from "react";
import Popup from "./Popup";
import { InputGlassmorphismFormProps } from "../UI/InputGlassmorphismForm";
import delete_table from "@/api/delete_table";
import { GlobalContext } from "@/store/global";

interface TableProps {
	id: number;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
	tasks: TaskResponse[];
	deleteTable: (id: number) => void;
}

const Table: React.FC<TableProps> = (props) => {
	const ctx = useContext(GlobalContext);
	const [showDeletePopup, setShowDeletePopup] = useState(false);

	const clickDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		delete_table(ctx.backend, props.id, props.deleteTable);
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
