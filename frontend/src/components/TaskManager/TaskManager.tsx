// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

// =============== Components =============== //
import Table from "./Table";
import Popup, { getInputValues } from "./Popup";
import { InputGlassmorphismFormProps } from "@/components/UI/InputGlassmorphismForm";

// =============== API =============== //
import getTables from "@/api/tables";
import getTasks from "@/api/tasks";
import add_table from "@/api/add_table";

// =============== Libraries =============== //
import { useParams } from "react-router-dom";
import { useGetOne, useRedirect, Title } from "react-admin";
import { useContext, useEffect, useReducer, useState } from "react";
import findIndex from "lodash/findIndex";
import get from "lodash/get";

// =============== Types =============== //
import { TableData, action } from "@/types/task_manager";

const updateTasks = (prevState: TableData[], action: action): TableData[] => {
	const index = findIndex(prevState, (value) => {
		return value.id === action.id;
	});
	switch (action.method) {
		case "Add":
			for (let i = 0; i < action.tables.length; i++) {
				action.tables[i].tasks = [];
			}
			return [...prevState, ...action.tables];
		case "Delete":
			if (index === -1) return prevState;
			return [...prevState.slice(0, index), ...prevState.slice(index + 1)];
		case "Replace":
			for (let i = 0; i < action.tables.length; i++) {
				action.tables[i].tasks = [];
			}
			return action.tables;
		case "ReplaceTasks":
			if (index === -1) return prevState;
			prevState[index].tasks = action.tasks;
			return [...prevState];
		case "AddTask":
			if (index === -1) return prevState;
			prevState[index].tasks = [...prevState[index].tasks, ...action.tasks];
			return [...prevState];
		case "DeleteTask":
			if (index === -1) return prevState;
			const taskIndex = findIndex(prevState[index].tasks, (value) => {
				return value.id === action.task_id;
			});
			if (taskIndex === -1) return prevState;
			prevState[index].tasks = [
				...prevState[index].tasks.slice(0, taskIndex),
				...prevState[index].tasks.slice(taskIndex + 1),
			];
			return [...prevState];
	}
};

const TaskManager: React.FC = () => {
	const { id } = useParams();
	const redirect = useRedirect();
	const globals = useContext(GlobalContext);
	const [showAddPopup, setShowAddPopup] = useState(false);
	const { data, isLoading } = useGetOne(
		"projects",
		{ id },
		{ onError: () => redirect("list", "projects") }
	);
	const name = get(data, "name");
	const [tables, dispatchTables] = useReducer(updateTasks, []);
	useEffect(() => {
		getTables(globals.backend, id!, dispatchTables);
	}, []);
	useEffect(() => {
		if (tables.length === 0) return;
		for (let i = 0; i < tables.length; i++) {
			const element = tables[i];
			if (element.tasks?.length > 0) return;
			getTasks(globals.backend, element.id, dispatchTables);
		}
	}, [tables]);

	const deleteTable = (id: number | string) => {
		dispatchTables({ id: id, method: "Delete" } as action);
	};

	const actualTables = tables.map((value) => {
		return (
			<Table
				key={value.id}
				id={value.id}
				title={value.title}
				description={value.description}
				created_at={value.created_at}
				updated_at={value.updated_at}
				deleteTable={deleteTable}
				tasks={value.tasks ? value.tasks : []}
				dispatchTables={dispatchTables}
			/>
		);
	});

	const addClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		const values = getInputValues(addInputs);
		values["project_id"] = id!;
		add_table(globals.backend, values, dispatchTables);
		setShowAddPopup(false);
	};

	const addInputs: InputGlassmorphismFormProps[] = [
		{
			id: "title",
			label: "title",
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
			{isLoading && <div>Loading...</div>}
			{!isLoading && (
				<div className={styles["task-manager-container"]}>
					<Title title={name} />
					{actualTables}
					<div className={styles["add-table"]}>
						<button
							onClick={(e) => {
								e.preventDefault();
								setShowAddPopup(true);
							}}
						>
							+
						</button>
					</div>
				</div>
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
		</>
	);
};

export default TaskManager;
