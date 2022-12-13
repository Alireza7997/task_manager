// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Components =============== //
import Table from "./Table";
import Popup, { getInputValues } from "./Popup";
import { InputGlassmorphismFormProps } from "@/components/UI/InputGlassmorphismForm";

// =============== Libraries =============== //
import { useContext, useEffect, useReducer, useState } from "react";
import findIndex from "lodash/findIndex";
import { useMutation, useQuery } from "react-query";
import find from "lodash/find";

// =============== Types =============== //
import { TableData, action } from "@/types/task_manager";
import Project from "@/types/project";
import ResponseType from "@/types/response";

// =============== Utils =============== //
import axios from "@/api/axios";
import { orderBy } from "lodash";

const taskReducer = (prevState: TableData[], action: action): TableData[] => {
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
				const table = find(
					prevState,
					(value) => value.id === action.tables[i].id
				);
				action.tables[i].tasks = table && table.tasks ? table.tasks : [];
			}
			return action.tables;
		case "ReplaceTable":
			if (index === -1 || action.tables.length === 0) return prevState;
			action.tables[0].tasks = prevState[index].tasks;
			return [
				...prevState.slice(0, index),
				action.tables[0],
				...prevState.slice(index + 1),
			];
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

const TaskManager = ({ project }: { project: Project }) => {
	const auth = useContext(AuthContext);
	const [showAddPopup, setShowAddPopup] = useState(false);
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [tables, dispatchTables] = useReducer(taskReducer, []);
	const [addTableFields, setAddTableFields] = useState<{
		title: string;
		description: string;
	}>({ title: "", description: "" });
	const [table, setTable] = useState<TableData | null>(null);
	const { data, status } = useQuery(
		`tables-${project.id}`,
		() =>
			axios
				.get<ResponseType>(
					`/projects/${project.id}/tables`,
					auth.getAuthHeaders()
				)
				.then((value) => value.data.message as TableData[]),
		{ enabled: auth.is_authenticated }
	);
	const { mutateAsync: mutateAsyncDelete } = useMutation(
		(tableId: number | string) =>
			axios.delete<ResponseType>(`/tables/${tableId}`, auth.getAuthHeaders())
	);
	const { mutateAsync: mutateAsyncAdd } = useMutation(() =>
		axios
			.post<ResponseType>(
				`/projects/${project.id}/tables`,
				addTableFields,
				auth.getAuthHeaders()
			)
			.then((value) => value.data.message as TableData)
	);

	const dataLen = (data && data.length) || 0;
	useEffect(() => {
		if (dataLen > 0 && tables.length !== dataLen) {
			dispatchTables({
				id: project.id,
				method: "Replace",
				tables: data,
			} as action);
		}
	}, [dataLen]);

	const deleteTable = (value: TableData) => {
		setTable(value);
		setShowDeletePopup(true);
	};

	const actualTables = orderBy(tables, (value) => value.id).map((value) => {
		return (
			<Table
				key={value.id}
				table={value}
				deleteTable={deleteTable}
				tasks={value.tasks ? value.tasks : []}
				dispatchTables={dispatchTables}
			/>
		);
	});

	const addInputs: InputGlassmorphismFormProps[] = [
		{
			id: "title",
			label: "title",
			type: "text",
			value: addTableFields.title,
			onChange: (e) =>
				setAddTableFields((prev) => {
					return { ...prev, title: e.target.value };
				}),
		},
		{
			id: "description",
			label: "description",
			type: "text",
			value: addTableFields.description,
			onChange: (e) =>
				setAddTableFields((prev) => {
					return { ...prev, description: e.target.value };
				}),
		},
	];

	const addButtons: InputGlassmorphismFormProps[] = [
		{
			id: "add",
			label: "add",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				mutateAsyncAdd().then((value) =>
					dispatchTables({ method: "Add", tables: [value] } as action)
				);
				setAddTableFields({ title: "", description: "" });
				setShowAddPopup(false);
			},
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				setAddTableFields({ title: "", description: "" });
				setShowAddPopup(false);
			},
		},
	];

	const deleteButtons: InputGlassmorphismFormProps[] = [
		{
			id: "delete",
			label: "delete",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				const id = table!.id;
				mutateAsyncDelete(id).then(() =>
					dispatchTables({ id: id, method: "Delete" } as action)
				);
				setShowDeletePopup(false);
			},
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				setTable(null);
				setShowDeletePopup(false);
			},
		},
	];

	return (
		<>
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
			{showDeletePopup && (
				<Popup
					addSquares={false}
					title={`Delete ${table?.title}?`}
					inputs={[]}
					buttons={deleteButtons}
					hide={() => {
						setTable(null);
						setShowDeletePopup(false);
					}}
				/>
			)}
			<div className={styles["task-manager-container"]}>
				{status === "success" && (
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
		</>
	);
};

export default TaskManager;
