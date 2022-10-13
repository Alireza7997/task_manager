// =============== Libraries =============== //
import { useParams } from "react-router-dom";
import { useGetOne, useRedirect, Title } from "react-admin";

// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Components =============== //
import Column from "./Column";
import { find, findIndex, get, remove } from "lodash";
import getTables, { TableResponse } from "@/api/tables";
import { useContext, useEffect, useReducer, useState } from "react";
import { GlobalContext } from "@/store/global";
import { DragDropContext } from "react-beautiful-dnd";
import getTasks, { task } from "@/api/tasks";

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
		getTables(globals.backend, id!, setTables)();
	}, []);
	useEffect(() => {
		if (tables.length !== 0) {
			console.log(tables);
			tables.map((value) => {
				getTasks(globals.backend, value.id, value.id, dispatchTasks)();
			});
		}
	}, [tables]);

	const deleteColumn = (id: number) => {
		setTables(remove(tables, (value) => value.id === id));
	};

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
						{tasks.map((value) => {
							const t = find(tables, (v) => v.id === value.id);
							const all_tasks = t ? value.tasks : [];
							return (
								<Column
									key={value.id}
									tasks={all_tasks}
									id={t!.id}
									title={t!.title}
									description={t!.description}
									created_at={t!.created_at}
									updated_at={t!.updated_at}
									deleteColumn={deleteColumn}
								/>
							);
						})}
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
