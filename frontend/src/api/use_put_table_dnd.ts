// =============== Libraries =============== //
import { AxiosError, AxiosRequestConfig } from "axios";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";

// =============== Utils =============== //
import CreateNotification from "@/notification/notification";
import axios from "./axios";

// =============== Types =============== //
import DndProps from "@/types/dnd_props";
import ResponseType from "@/types/response";

const usePutTableDND = (headers: AxiosRequestConfig) => {
	const snackProvider = useSnackbar();
	const { mutateAsync, mutate } = useMutation((props: DndProps) =>
		axios
			.put<ResponseType>(
				`/tables/${props.tableID}/move`,
				{ current_prev: props.cPrev, prev: props.prev },
				headers
			)
			.catch((reason: AxiosError) => {
				const data = reason.response?.data as ResponseType;
				if (data) {
					CreateNotification(
						data.title,
						data.message as string,
						"error",
						snackProvider
					);
				} else {
					CreateNotification(
						"Unknown",
						"An unknown error happened",
						"error",
						snackProvider
					);
				}
				throw reason;
			})
	);

	return {
		mutate,
		mutateAsync,
	};
};

export default usePutTableDND;
