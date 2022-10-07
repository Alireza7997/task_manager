// =============== Libraries =============== //
import { useParams } from "react-router-dom";
import { useGetOne, useRedirect, Title } from "react-admin";

// =============== Styles =============== //
import styles from "@/styles/TaskManager/TaskManager.module.css";

// =============== Components =============== //
import Column from "./Column";
import { get } from "lodash";
import getTables, { TableResponse } from "@/api/tables";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/store/global";

const TaskManager: React.FC = () => {
	const globals = useContext(GlobalContext);
	const { id } = useParams();
	const redirect = useRedirect();
	const { data, isLoading } = useGetOne(
		"projects",
		{ id },
		{ onError: () => redirect("list", "projects") }
	);
	const name = get(data, "name");
	const [tables, setTables] = useState<TableResponse[]>([] as TableResponse[]);
	useEffect(() => {
		getTables(globals.backend, id!, setTables)();
	}, []);

	return (
		<>
			{isLoading && <div>Loading...</div>}
			{!isLoading && (
				<div className={styles["task-manager-container"]}>
					<Title title={name} />
					{tables.map((value) => {
						return (
							<Column
								key={value.id}
								id={value.id}
								title={value.title}
								description={value.description}
								created_at={value.created_at}
								updated_at={value.updated_at}
							/>
						);
					})}
					<div className={styles["add-table"]}>
						<button>+</button>
					</div>
				</div>
			)}
		</>
	);
};

export default TaskManager;
