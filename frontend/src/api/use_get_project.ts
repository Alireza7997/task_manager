// =============== Libraries =============== //
import { AxiosError, AxiosRequestConfig } from "axios";
import { useSnackbar } from "notistack";
import { useQuery } from "react-query";

// =============== Utils =============== //
import CreateNotification from "@/notification/notification";
import axios from "./axios";

// =============== Type =============== //
import Project from "@/types/project";
import ResponseType from "@/types/response";

const useGetProject = (
	id: number,
	headers: AxiosRequestConfig,
	enabled: boolean
) => {
	const snackProvider = useSnackbar();
	const { data, status, refetch } = useQuery(
		["project", id],
		() =>
			axios
				.get<ResponseType>(`/projects/${id}`, headers)
				.then((value) => value.data.message as Project)
				.catch((reason: AxiosError) => {
					const data = reason.response?.data as ResponseType;
					CreateNotification(
						data.title,
						data.message as string,
						"error",
						snackProvider
					);
					throw reason;
				}),
		{
			enabled: enabled,
			refetchOnWindowFocus: false,
			retry: 0,
		}
	);

	return { data: data as Project, status, refetch };
};

export default useGetProject;
