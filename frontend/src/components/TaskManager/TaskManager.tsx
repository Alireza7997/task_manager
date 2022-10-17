// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

// =============== Components =============== //
import Table from "./Table";

// =============== API =============== //
import getTables, { TableResponse } from "@/api/tables";

// =============== Libraries =============== //
import { useParams } from "react-router-dom";
import { useGetOne, useRedirect, Title } from "react-admin";
import { get, remove } from "lodash";
import { useContext, useEffect, useState } from "react";

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
	useEffect(() => {
		getTables(globals.backend, id!, setTables);
	}, []);

	const deleteTable = (id: number | string) => {
		setTables(remove(tables, (value) => value.id.toString() === id.toString()));
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

	return (
		<>
			{isLoading && <div>Loading...</div>}
			{!isLoading && (
				<div className={styles["task-manager-container"]}>
					<Title title={name} />
					{actualTables}
					<div className={styles["add-table"]}>
						<button>+</button>
					</div>
				</div>
			)}
		</>
	);
};

export default TaskManager;
