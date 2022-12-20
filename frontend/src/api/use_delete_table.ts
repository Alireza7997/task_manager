// =============== Libraries =============== //
import { AxiosError, AxiosRequestConfig } from "axios";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";

// =============== Utils =============== //
import CreateNotification from "@/notification/notification";
import axios from "./axios";

// =============== Types =============== //
import ResponseType from "@/types/response";

const useDeleteTable = (headers: AxiosRequestConfig) => {
	const snackProvider = useSnackbar();
	const { mutateAsync, mutate } = useMutation((tableID: number | string) =>
		axios
			.delete<ResponseType>(`/tables/${tableID}`, headers)
			.catch((reason: AxiosError) => {
				const data = reason.response?.data as ResponseType;
				CreateNotification(
					data.title,
					data.message as string,
					"error",
					snackProvider
				);
				throw reason;
			})
	);

	return {
		mutate,
		mutateAsync,
	};
};

export default useDeleteTable;
