// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Components =============== //
import Table from "./Table";
import Popup, { getInputValues } from "./Popup";
import { InputGlassmorphismFormProps } from "@/components/UI/InputGlassmorphismForm";

// =============== API =============== //
import get_tables from "@/api/get_tables";
import get_tasks from "@/api/get_tasks";
import add_table from "@/api/add_table";

// =============== Libraries =============== //
import { useContext, useEffect, useReducer, useState } from "react";
import findIndex from "lodash/findIndex";
import get from "lodash/get";

// =============== Types =============== //
import { TableData, action } from "@/types/task_manager";
import Head from "next/head";

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
	const auth = useContext(AuthContext);
	const [showAddPopup, setShowAddPopup] = useState(false);
	const [isLoading, setIsLoading] = useState(10000);
	const [localIsLoading, setLocalIsLoading] = useState(10000);
	const [tables, dispatchTables] = useReducer(updateTasks, []);
	const tableLen = tables.length;
	useEffect(() => {
		//! Table_id comes instead of 1
		get_tables(auth, 1, dispatchTables, (count: number) => {
			setIsLoading(count);
		});
	}, []);
	useEffect(() => {
		if (tables.length === 0) return;
		if (localIsLoading !== 0 && tableLen === localIsLoading) {
			for (let i = 0; i < tables.length; i++) {
				const element = tables[i];
				get_tasks(auth, element.id, dispatchTables, () => {
					setIsLoading((prev) => {
						return prev - 1;
					});
				});
			}
		}
	}, [tableLen]);

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
		//! Table_id comes instead of 1
		add_table(auth, values, 1!, dispatchTables);
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
			<Head>
				{/*! Table name comes instead of 1 */}
				<title>1 Project</title>
			</Head>
			<div className={styles["task-manager-container"]}>
				{isLoading ||
					(localIsLoading !== 0 && (
						<div className="w-full flex flex-col justify-center items-center">
							<h3>Loading...</h3>
						</div>
					))}
				{!isLoading && localIsLoading === 0 && (
					<>
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
					</>
				)}
			</div>
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
