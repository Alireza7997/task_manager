// =============== Libraries =============== //
import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import TableOfData from "@/components/UI/TableOfData";
import { useQuery } from "react-query";
import { useContext } from "react";

// =============== Utils =============== //
import axios from "@/api/axios";
import { CatchErrorWithoutRepeat } from "@/api/utils/catch_error";

// =============== Types =============== //
import ResponseType from "@/types/response";
import Project from "@/types/project";

// =============== Store =============== //
import { AuthContext } from "@/store/auth";

const TaskManager = () => {
	const auth = useContext(AuthContext);
	// const { data, status, error, isError } = useQuery("projects", () =>
	// 	axios
	// 		.get<ResponseType>("/projects", auth.getAuthHeaders())
	// 		.then((value) => value.data.message as Project[])
	// );

	return (
		<DashboardContainer title="task manager - projects">
			<div className="flex-grow">
				<div className="w-[5000px]"></div>
				{/* <TableOfData
					headerList={data!.length > 0 ? Object.keys(data![0]) : []}
					list={data!}
				/> */}
				<></>
			</div>
		</DashboardContainer>
	);
};

TaskManager.DashboardLayout = DashboardLayout;

export default TaskManager;
