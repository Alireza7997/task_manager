// =============== Libraries =============== //
import { useMutation, useQuery } from "react-query";
import { useContext, useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";

// =============== Components =============== //
import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import TableOfData from "@/components/UI/TableOfData";
import Popup from "@/components/TaskManager/Popup";
import { InputGlassmorphismFormProps } from "@/components/UI/InputGlassmorphismForm";

// =============== Utils =============== //
import axios from "@/api/axios";

// =============== Types =============== //
import ResponseType from "@/types/response";
import Project from "@/types/project";

// =============== Store =============== //
import { AuthContext } from "@/store/auth";

const TaskManager = () => {
	const auth = useContext(AuthContext);
	const [showAdd, setShowAdd] = useState(false);
	const [projectName, setProjectName] = useState("");
	const { data, status, refetch } = useQuery(
		["projects", auth.is_authenticated],
		() =>
			axios
				.get<ResponseType>("/projects", auth.getAuthHeaders())
				.then((value) => {
					const data = value.data.message as Record<string, string>[];
					const output: Project[] = [];
					for (let i = 0; i < data.length; i++) {
						const element = data[i];
						output.push(
							new Project(
								element["id"],
								element["name"],
								element["created_at"],
								element["updated_at"]
							)
						);
					}
					return output;
				})
	);

	const { mutate, isSuccess } = useMutation(() =>
		axios
			.post<ResponseType>(
				"/projects",
				{ name: projectName },
				auth.getAuthHeaders()
			)
			.finally(() => setProjectName(""))
	);

	useEffect(() => {
		if (isSuccess) refetch();
	}, [isSuccess]);

	const inputs: InputGlassmorphismFormProps[] = [
		{
			id: "name",
			label: "name",
			type: "text",
			value: projectName,
			onChange: (e) => setProjectName(e.currentTarget.value),
		},
	];

	const buttons: InputGlassmorphismFormProps[] = [
		{
			id: "submit",
			label: "submit",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				mutate();
				setShowAdd(false);
			},
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: () => {
				setShowAdd(false);
			},
		},
	];

	return (
		<>
			{showAdd && (
				<Popup
					title="Add Project"
					addSquares={false}
					hide={() => setShowAdd(false)}
					inputs={inputs}
					buttons={buttons}
				></Popup>
			)}
			<DashboardContainer title="task manager - projects">
				<div className="flex-grow overflow-y-scroll">
					{status === "success" ? (
						<TableOfData
							headerList={data.length > 0 ? Object.keys(data[0]) : []}
							list={data}
						/>
					) : (
						<></>
					)}
					<Button
						className="fixed h-[80px] w-[80px] right-8 bottom-8 rounded-full p-0"
						onClick={() => {
							setShowAdd(true);
						}}
					>
						<AddCircleIcon className="h-full w-full" htmlColor="#4C70FF" />
					</Button>
				</div>
			</DashboardContainer>
		</>
	);
};

TaskManager.DashboardLayout = DashboardLayout;

export default TaskManager;
