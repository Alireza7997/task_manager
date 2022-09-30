// =============== Styles =============== //
import styles from "@/styles/pages/dashboard.module.css";

// =============== Components =============== //
import Column from "@/components/TaskManager/Column";
import ComboBox from "@/components/UI/Combobox";

const Dashboard: React.FC<React.PropsWithChildren> = (
	props: React.PropsWithChildren
) => {
	return (
		<div className={styles["task-manager-container"]}>
			<ComboBox />
			<div className={styles["task-manager"]}>
				<Column></Column>
				<Column></Column>
				<div className={styles["add-table"]}>
					<button>+</button>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
