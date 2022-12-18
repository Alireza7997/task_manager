// =============== Libraries =============== //
import { useContext } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Head from "next/head";

// =============== Components =============== //
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardContainer from "@/components/Dashboard/DashboardContainer";

// =============== Sore =============== //
import { AuthContext } from "@/store/auth";

// =============== Utils =============== //
import axios from "@/api/axios";

// =============== Type =============== //
import ResponseType from "@/types/response";
import Project from "@/types/project";
import TaskManager from "@/components/TaskManager/TaskManager";

const TaskManagerID = () => {
	const auth = useContext(AuthContext);
	const router = useRouter();
	const { id } = router.query;
	const { data, status } = useQuery(
		"project-" + id,
		() =>
			axios
				.get<ResponseType>(`/projects/${id}`, auth.getAuthHeaders())
				.then((value) => value.data.message as Project),
		{
			enabled: auth.is_authenticated && id !== undefined,
			refetchOnWindowFocus: false,
		}
	);

	return (
		<>
			<Head>
				<title>
					{"Task Manager" + (status === "success" ? " - " + data!.name : "")}
				</title>
			</Head>
			<DashboardContainer
				title={
					status === "success" ? `task manager - ${data.name}` : "loading..."
				}
			>
				{status === "success" ? <TaskManager project={data} /> : <></>}
			</DashboardContainer>
		</>
	);
};

TaskManagerID.DashboardLayout = DashboardLayout;

export default TaskManagerID;
