// =============== Libraries =============== //
import { useContext, useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Head from "next/head";

// =============== Components =============== //
import DashboardContainer from "@/components/Dashboard/DashboardContainer";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import TableOfData from "@/components/UI/TableOfData";
import Popup from "@/components/TaskManager/Popup";
import InputGlassmorphismForm, {
	InputGlassmorphismFormProps,
} from "@/components/UI/InputGlassmorphismForm";

// =============== Types =============== //
import Project from "@/types/project";

// =============== Store =============== //
import { AuthContext } from "@/store/auth";
import Router from "next/router";

// =============== API =============== //
import useGetProjects from "@/api/use_get_projects";
import usePostProject from "@/api/use_post_project";
import useDeleteProject from "@/api/use_delete_project";
import usePutProject from "@/api/use_put_project";

const TaskManager = () => {
	const auth = useContext(AuthContext);
	const [showAdd, setShowAdd] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [projectAdd, setProjectAdd] = useState<Project | null>(null);
	const [projectRemove, setProjectRemove] = useState<Project | null>(null);
	const [projectEdit, setProjectEdit] = useState<Project | null>(null);
	const projectPost = usePostProject(auth.getAuthHeaders());
	const projectsGet = useGetProjects(
		auth.getAuthHeaders(),
		auth.is_authenticated
	);
	const projectDelete = useDeleteProject(auth.getAuthHeaders());
	const projectPut = usePutProject(auth.getAuthHeaders());

	useEffect(() => {
		if (projectPost.isSuccess) projectsGet.refetch();
	}, [projectPost.isSuccess]);

	useEffect(() => {
		if (projectDelete.isSuccess) projectsGet.refetch();
	}, [projectDelete.isSuccess]);

	useEffect(() => {
		if (projectPut.isSuccess) projectsGet.refetch();
	}, [projectPut.isSuccess]);

	const addInputs: InputGlassmorphismFormProps[] = [
		{
			id: "name",
			label: "name",
			type: "text",
			value: projectAdd?.name,
			onChange: (e) =>
				setProjectAdd((prev) => {
					return { ...prev, name: e.target.value } as Project;
				}),
		},
	];

	const addButtons: InputGlassmorphismFormProps[] = [
		{
			id: "submit",
			label: "submit",
			type: "button",
			onClick: async (e) => {
				e.preventDefault();
				await projectPost
					.mutateAsync(projectAdd!)
					.finally(() => setProjectAdd(null));
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

	const deleteButtons: InputGlassmorphismFormProps[] = [
		{
			id: "confirm",
			label: "confirm",
			type: "button",
			onClick: async (e) => {
				e.preventDefault();
				await projectDelete
					.mutateAsync(projectRemove!.id)
					.finally(() => setProjectRemove(null));
				setShowDelete(false);
			},
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: () => {
				setShowDelete(false);
				setProjectRemove(null);
			},
		},
	];

	const editInputs: InputGlassmorphismFormProps[] = [
		{
			id: "name",
			label: "name",
			type: "text",
			value: projectEdit?.name,
			onChange: (e) =>
				setProjectEdit((prev) => {
					return { ...prev, name: e.target.value } as Project;
				}),
		},
	];

	const editButtons: InputGlassmorphismFormProps[] = [
		{
			id: "confirm",
			label: "confirm",
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				projectPut
					.mutateAsync(projectEdit!)
					.finally(() => setProjectEdit(null));
				setShowEdit(false);
			},
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: () => {
				setShowEdit(false);
				setProjectEdit(null);
			},
		},
	];

	return (
		<>
			{showDelete && projectDelete && (
				<Popup
					title={`Delete ${projectRemove!.name}?`}
					addSquares={false}
					hide={() => setShowDelete(false)}
					inputs={[]}
					buttons={deleteButtons}
				/>
			)}
			{showEdit && projectEdit && (
				<Popup
					title={`Edit Project`}
					addSquares={false}
					hide={() => setShowEdit(false)}
					inputs={editInputs}
					buttons={editButtons}
				/>
			)}
			{showAdd && (
				<Popup
					title="Add Project"
					addSquares={false}
					hide={() => setShowAdd(false)}
					inputs={addInputs}
					buttons={addButtons}
				/>
			)}
			<Head>
				<title>Task Manager - Projects</title>
			</Head>
			<DashboardContainer title="task manager - projects">
				<div className="flex-grow overflow-y-scroll">
					{projectsGet.status === "loading" && <h1>Loading....</h1>}
					{projectsGet.status === "success" ? (
						<TableOfData
							headerList={
								projectsGet.data.length > 0
									? Object.keys(projectsGet.data[0])
									: []
							}
							list={projectsGet.data}
							onDeleteClick={(value: Project) => {
								setProjectRemove(value);
								setShowDelete(true);
							}}
							onEditClick={(value: Project) => {
								setProjectEdit(value);
								setShowEdit(true);
							}}
							onClick={(value: Project) =>
								Router.push("/task_manager/" + value.id)
							}
						/>
					) : (
						<></>
					)}
					<InputGlassmorphismForm
						type="button"
						label=""
						className="fixed h-[80px] w-[80px] right-8 bottom-8 rounded-full p-0 text-white bg-[#4C70FF] hover:bg-[#1976D2] active:bg-[#1565C0]"
						onClick={() => {
							setShowAdd(true);
						}}
					>
						<AddCircleIcon className="!h-full !w-full" />
					</InputGlassmorphismForm>
				</div>
			</DashboardContainer>
		</>
	);
};

TaskManager.DashboardLayout = DashboardLayout;

export default TaskManager;
