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

const usePutProjectsDND = (headers: AxiosRequestConfig) => {
	const snackProvider = useSnackbar();
	const { mutateAsync, mutate } = useMutation((props: DndProps) =>
		axios
			.put<ResponseType>(
				`/tasks/${props.taskID}/to_table/${props.tableID}`,
				{ current_prev: props.cPrev, prev: props.prev },
				headers
			)
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

export default usePutProjectsDND;
