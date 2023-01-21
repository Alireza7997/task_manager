// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Stores =============== //
import { AuthContext } from "@/store/auth";

// =============== Components =============== //
import Table from "./Table";
import Popup from "./Popup";
import { InputGlassmorphismFormProps } from "@/components/UI/InputGlassmorphismForm";

// =============== Libraries =============== //
import { useContext, useReducer, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import findIndex from "lodash/findIndex";
import orderBy from "lodash/orderBy";
import find from "lodash/find";

// =============== Types =============== //
import { TableData, action } from "@/types/task_manager";
import Project from "@/types/project";

// =============== API =============== //
import useGetTables from "@/api/use_get_tables";
import usePutProjectDND from "@/api/use_put_project_dnd";
import useDeleteTable from "@/api/use_delete_table";
import usePostTable from "@/api/use_post_table";

function move(arr: any, old_index: any, new_index: any) {
	while (old_index < 0) {
		old_index += arr.length;
	}
	while (new_index < 0) {
		new_index += arr.length;
	}
	if (new_index >= arr.length) {
		var k = new_index - arr.length;
		while (k-- + 1) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
}

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
		case "DnDTable":
			return [...move(prevState, action.sourceIndex, action.destinationIndex)];
		case "DnD":
			if (action.id === action.toTable) {
				prevState[index].tasks = move(
					prevState[index].tasks,
					action.sourceIndex,
					action.destinationIndex
				);
				return [...prevState];
			}

			const movingTask = prevState[index].tasks[action.sourceIndex];
			// Remove it
			prevState[index].tasks = [
				...prevState[index].tasks.slice(0, action.sourceIndex),
				...prevState[index].tasks.slice(action.sourceIndex + 1),
			];
			// Find to table index
			const toIndex = findIndex(
				prevState,
				(value) => value.id === action.toTable
			);
			// Move it to new table
			prevState[toIndex].tasks = [
				...prevState[toIndex].tasks.slice(0, action.destinationIndex),
				movingTask,
				...prevState[toIndex].tasks.slice(action.destinationIndex),
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
	const tablesDelete = useDeleteTable(headers);
	const tablesPost = usePostTable(project.id, headers);
	const projectsDND = usePutProjectDND(auth.getAuthHeaders());
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

	const DropFunction = (result: DropResult) => {
		const { source, destination } = result;
		if (destination === null || destination === undefined) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		)
			return;

		// If it's a table
		if (source.droppableId === "project") {
			dispatchTables({
				method: "DnDTable",
				sourceIndex: source.index,
				destinationIndex: destination.index,
			} as action);
			return;
		}

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
		projectsDND
			.mutateAsync({
				cPrev: cPrev,
				prev: prev,
				tableID: destinationTableID,
				taskID: taskID,
			})
			.catch(() => {
				dispatchTables({
					method: "DnD",
					id: sourceTableID,
					toTable: destinationTableID,
					sourceIndex: destination.index,
					destinationIndex: source.index,
				} as action);
			});
		dispatchTables({
			method: "DnD",
			id: sourceTableID,
			toTable: destinationTableID,
			sourceIndex: source.index,
			destinationIndex: destination.index,
		} as action);
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
					<DragDropContext onDragEnd={DropFunction}>
						{/* Actual Tables */}
						<Droppable
							droppableId="project"
							type="TABLE"
							direction="horizontal"
						>
							{(provided, snapshot) => {
								return (
									<>
										<div
											ref={provided.innerRef}
											{...provided.droppableProps}
											className={styles["task-manager-container"]}
										>
											{tables.map((value, index) => {
												return (
													<Table
														key={value.id}
														index={index}
														table={value}
														deleteTable={deleteTable}
														dispatchTables={dispatchTables}
													/>
												);
											})}
										</div>
										{provided.placeholder}
									</>
								);
							}}
						</Droppable>
						{/* End Of Actual Tables */}
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
					</DragDropContext>
				)}
			</div>
		</>
	);
};

export default TaskManager;
