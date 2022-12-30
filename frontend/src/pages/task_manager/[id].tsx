// =============== Libraries =============== //
import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// =============== Components =============== //
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardContainer from "@/components/Dashboard/DashboardContainer";

// =============== Sore =============== //
import { AuthContext } from "@/store/auth";

// =============== Utils =============== //
import useGetProject from "@/api/use_get_project";

// =============== Type =============== //
import TaskManager from "@/components/TaskManager/TaskManager";

const TaskManagerID = () => {
	const auth = useContext(AuthContext);
	const router = useRouter();
	const { id: idString } = router.query;
	const id = parseInt(idString as string);
	const project = useGetProject(
		id,
		auth.getAuthHeaders(),
		auth.is_authenticated && idString !== undefined
	);

	return (
		<>
			<Head>
				<title>
					{"Task Manager" +
						(project.status === "success" ? " - " + project.data.name : "")}
				</title>
			</Head>
			<DashboardContainer
				title={
					project.status === "success"
						? `task manager / ${project.data.name}`
						: "loading..."
				}
			>
				{project.status === "success" && <TaskManager project={project.data} />}
			</DashboardContainer>
		</>
	);
};

TaskManagerID.DashboardLayout = DashboardLayout;

export default TaskManagerID;
