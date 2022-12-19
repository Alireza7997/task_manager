// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Components =============== //
import Table from "./Table";
import Popup from "./Popup";
import { InputGlassmorphismFormProps } from "@/components/UI/InputGlassmorphismForm";

// =============== Libraries =============== //
import { useContext, useEffect, useReducer, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useMutation, useQuery } from "react-query";
import findIndex from "lodash/findIndex";
import orderBy from "lodash/orderBy";
import find from "lodash/find";

// =============== Types =============== //
import { TableData, action } from "@/types/task_manager";
import Project from "@/types/project";
import ResponseType from "@/types/response";

// =============== Utils =============== //
import axios from "@/api/axios";

// =============== API =============== //
import useGetTables from "@/api/use_get_tables";
import usePutProjectsDND from "@/api/use_put_projects_dnd";
import useDeleteTables from "@/api/use_delete_tables";
import usePostTables from "@/api/use_post_tables";

const taskReducer = (prevState: TableData[], action: action): TableData[] => {
	const index = findIndex(prevState, (value) => {
		return value.id === action.id;
	});
	const taskIndex =
		index > -1
			? findIndex(prevState[index].tasks, (value) => {
					return value.id === action.task_id;
			  })
			: -1;
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
			if (index === -1 || action.tasks.length !== 1) return prevState;
			prevState[index].tasks = [...prevState[index].tasks, action.tasks[0]];
			return [...prevState];
		case "DeleteTask":
			if (index === -1) return prevState;
			if (taskIndex === -1) return prevState;
			prevState[index].tasks = [
				...prevState[index].tasks.slice(0, taskIndex),
				...prevState[index].tasks.slice(taskIndex + 1),
			];
			return [...prevState];
		case "ReplaceTask":
			if (index === -1) return prevState;
			if (taskIndex === -1 || action.tasks.length !== 1) return prevState;
			prevState[index].tasks[taskIndex] = action.tasks[0];
			return [...prevState];
		case "DnD":
			const sourceTableIndex = findIndex(
				prevState,
				(value) => value.id === action.source.tableID
			);
			const sourceTaskIndex = action.source.taskIndex;
			const task = prevState[sourceTableIndex].tasks[sourceTaskIndex];
			prevState[sourceTableIndex].tasks = [
				...prevState[sourceTableIndex].tasks.slice(0, sourceTaskIndex),
				...prevState[sourceTableIndex].tasks.slice(sourceTaskIndex + 1),
			];
			const destinationTableIndex = findIndex(
				prevState,
				(value) => value.id === action.destination.tableID
			);
			const destinationTaskIndex = action.destination.taskIndex;
			prevState[destinationTableIndex].tasks = [
				...prevState[destinationTableIndex].tasks.slice(
					0,
					destinationTaskIndex
				),
				task,
				...prevState[destinationTableIndex].tasks.slice(destinationTaskIndex),
			];
			return [...prevState];
	}
};

interface tableFields {
	title: string;
	description: string;
}

const TaskManager = ({ project }: { project: Project }) => {
	const auth = useContext(AuthContext);
	const headers = auth.getAuthHeaders();
	const is_authenticated = auth.is_authenticated;
	const [showAddPopup, setShowAddPopup] = useState(false);
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [tables, dispatchTables] = useReducer(taskReducer, []);
	const [addTableFields, setAddTableFields] = useState({} as tableFields);
	const [table, setTable] = useState<TableData | null>(null);
	const tablesDelete = useDeleteTables(headers);
	const tablesPost = usePostTables(project.id, headers);
	const projectsDND = usePutProjectsDND(auth.getAuthHeaders());
	const tablesGet = useGetTables(
		project.id,
		headers,
		is_authenticated,
		dispatchTables
	);

	const deleteTable = (value: TableData) => {
		setTable(value);
		setShowDeletePopup(true);
	};

	const DropFunction = async (result: DropResult) => {
		const { source, destination } = result;
		if (destination === null || destination === undefined) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		)
			return;

		const sourceTableID = parseInt(source.droppableId);
		const destinationTableID = parseInt(destination.droppableId);

		const sourceTableIndex = findIndex(
			tables,
			(value) => value.id === sourceTableID
		);
		const destinationTableIndex = findIndex(
			tables,
			(value) => value.id === destinationTableID
		);
		const taskID = tables[sourceTableIndex].tasks[source.index].id;
		const cPrev =
			source.index - 1 > -1
				? tables[sourceTableIndex].tasks[source.index - 1].id
				: 0;
		const prev =
			destination.index - 1 > -1
				? tables[destinationTableIndex].tasks[destination.index - 1].id
				: 0;
		await projectsDND
			.mutateAsync({
				cPrev: cPrev,
				prev: prev,
				tableID: destinationTableID,
				taskID: taskID,
			})
			.then(() =>
				dispatchTables({
					method: "DnD",
					source: {
						tableID: parseInt(source.droppableId),
						taskIndex: source.index,
					},
					destination: {
						tableID: parseInt(destination.droppableId),
						taskIndex: destination.index,
					},
				} as action)
			);
	};

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
				tablesPost
					.mutateAsync(addTableFields as TableData)
					.then((value) =>
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
				tablesDelete
					.mutateAsync(id)
					.then(() => dispatchTables({ id: id, method: "Delete" } as action));
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
				{tablesGet.status === "success" && (
					<>
						<DragDropContext onDragEnd={DropFunction}>
							{/* Actual Tables */}
							{orderBy(tables, (value) => value.id).map((value) => {
								return (
									<Table
										key={value.id}
										table={value}
										deleteTable={deleteTable}
										dispatchTables={dispatchTables}
									/>
								);
							})}
							{/* End Of Actual Tables */}
						</DragDropContext>
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
