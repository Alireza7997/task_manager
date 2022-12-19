// =============== Libraries =============== //
import { AxiosError, AxiosRequestConfig } from "axios";
import { useSnackbar } from "notistack";
import { useQuery } from "react-query";
import orderBy from "lodash/orderBy";

// =============== Utils =============== //
import CreateNotification from "@/notification/notification";
import axios from "./axios";

// =============== Type =============== //
import Project from "@/types/project";
import ResponseType from "@/types/response";

const useGetProjects = (headers: AxiosRequestConfig, enabled: boolean) => {
	const snackProvider = useSnackbar();
	const { data, status, refetch } = useQuery(
		"projects",
		() =>
			axios
				.get<ResponseType>("/projects", headers)
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
				})
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
		}
	);

	return {
		data: data as Project[],
		status,
		refetch,
	};
};

export default useGetProjects;
