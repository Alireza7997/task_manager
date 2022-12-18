// =============== Libraries =============== //
import { useMutation, useQuery } from "react-query";
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

// =============== Utils =============== //
import axios from "@/api/axios";

// =============== Types =============== //
import ResponseType from "@/types/response";
import Project from "@/types/project";

// =============== Store =============== //
import { AuthContext } from "@/store/auth";
import Router from "next/router";
import orderBy from "lodash/orderBy";

const TaskManager = () => {
	const auth = useContext(AuthContext);
	const [showAdd, setShowAdd] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [projectAdd, setProjectAdd] = useState<Project | null>(null);
	const [projectDelete, setProjectDelete] = useState<Project | null>(null);
	const [projectEdit, setProjectEdit] = useState<Project | null>(null);
	const { data, status, refetch } = useQuery(
		"projects",
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
					return orderBy(output, (value) => value.id);
				}),
		{ enabled: auth.is_authenticated, refetchOnWindowFocus: false }
	);
	const { mutate: mutatePost, isSuccess: isSuccessPost } = useMutation(() =>
		axios
			.post<ResponseType>("/projects", projectAdd, auth.getAuthHeaders())
			.finally(() => setProjectDelete(null))
	);
	const { mutate: mutateDelete, isSuccess: isSuccessDelete } = useMutation(() =>
		axios
			.delete<ResponseType>(
				"/projects/" + projectDelete?.id,
				auth.getAuthHeaders()
			)
			.finally(() => setProjectDelete(null))
	);
	const { mutate: mutateEdit, isSuccess: isSuccessEdit } = useMutation(() =>
		axios
			.put<ResponseType>(
				"/projects/" + projectEdit?.id,
				projectEdit,
				auth.getAuthHeaders()
			)
			.finally(() => setProjectEdit(null))
	);

	useEffect(() => {
		if (isSuccessPost) refetch();
	}, [isSuccessPost]);

	useEffect(() => {
		if (isSuccessDelete) refetch();
	}, [isSuccessDelete]);

	useEffect(() => {
		if (isSuccessEdit) refetch();
	}, [isSuccessEdit]);

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
			onClick: (e) => {
				e.preventDefault();
				mutatePost();
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
			onClick: (e) => {
				e.preventDefault();
				mutateDelete();
				setShowDelete(false);
			},
		},
		{
			id: "cancel",
			label: "cancel",
			type: "button",
			onClick: () => {
				setShowDelete(false);
				setProjectDelete(null);
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
				mutateEdit();
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
					title={`Delete ${projectDelete.name}?`}
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
					{status === "success" ? (
						<TableOfData
							headerList={data.length > 0 ? Object.keys(data[0]) : []}
							list={data}
							onDeleteClick={(value: Project) => {
								setProjectDelete(value);
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
						<AddCircleIcon className="h-full w-full" />
					</InputGlassmorphismForm>
				</div>
			</DashboardContainer>
		</>
	);
};

TaskManager.DashboardLayout = DashboardLayout;

export default TaskManager;
