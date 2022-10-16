// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

// =============== Components =============== //
import Table from "./Table";

// =============== API =============== //
import getTables, { TableResponse } from "@/api/tables";
import getTasks, { task } from "@/api/tasks";

// =============== Libraries =============== //
import { useParams } from "react-router-dom";
import { useGetOne, useRedirect, Title } from "react-admin";
import { find, findIndex, get, remove } from "lodash";
import { DragDropContext } from "react-beautiful-dnd";
import { useContext, useEffect, useReducer, useState } from "react";

const updateTasks = (prevState: task[], action: task) => {
	const index = findIndex(prevState, (value) => {
		return value.id === action.id;
	});
	if (index === -1) prevState.push(action);
	else {
		prevState[index] = action;
	}

	return prevState;
};

const TaskManager: React.FC = () => {
	const { id } = useParams();
	const redirect = useRedirect();
	const globals = useContext(GlobalContext);
	const { data, isLoading } = useGetOne(
		"projects",
		{ id },
		{ onError: () => redirect("list", "projects") }
	);
	const name = get(data, "name");
	const [tables, setTables] = useState<TableResponse[]>([] as TableResponse[]);
	const [tasks, dispatchTasks] = useReducer(updateTasks, []);
	useEffect(() => {
		getTables(globals.backend, id!, setTables);
	}, []);

	const deleteTable = (id: number) => {
		setTables(remove(tables, (value) => value.id === id));
	};

	const actualTables = tables.map((value) => {
		const ts = find(tasks, (t) => t.id === value.id);
		return (
			<Table
				key={value.id}
				tasks={ts?.tasks ? ts.tasks : []}
				id={value.id}
				title={value.title}
				description={value.description}
				created_at={value.created_at}
				updated_at={value.updated_at}
				deleteTable={deleteTable}
				dispatchTasks={dispatchTasks}
			/>
		);
	});

	return (
		<>
			{isLoading && <div>Loading...</div>}
			{!isLoading && (
				<div className={styles["task-manager-container"]}>
					<Title title={name} />
					<DragDropContext
						onDragEnd={(result, provided) => {
							console.log(result, provided);
						}}
					>
						{actualTables}
					</DragDropContext>
					<div className={styles["add-table"]}>
						<button>+</button>
					</div>
				</div>
			)}
		</>
	);
};

export default TaskManager;
