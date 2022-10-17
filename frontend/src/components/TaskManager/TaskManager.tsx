// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

// =============== Components =============== //
import Table from "./Table";
import Popup, { getInputValues } from "./Popup";
import { InputGlassmorphismFormProps } from "@/components/UI/InputGlassmorphismForm";

// =============== API =============== //
import getTables, { TableResponse } from "@/api/tables";
import add_table from "@/api/add_table";

// =============== Libraries =============== //
import { useParams } from "react-router-dom";
import { useGetOne, useRedirect, Title } from "react-admin";
import { get, remove } from "lodash";
import { useContext, useEffect, useState } from "react";

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
	const [tables, setTables] = useState<TableResponse[]>([] as TableResponse[]);
	useEffect(() => {
		getTables(globals.backend, id!, setTables);
	}, []);

	const deleteTable = (id: number | string) => {
		setTables(remove(tables, (value) => value.id.toString() !== id.toString()));
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
			/>
		);
	});

	const addClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		const values = getInputValues(addInputs);
		values["project_id"] = id!;
		add_table(globals.backend, values, setTables);
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
