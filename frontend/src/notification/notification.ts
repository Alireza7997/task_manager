// =============== Libraries =============== //
import { VariantType, ProviderContext } from "notistack";

const CreateNotification = (
	title: string,
	message: string,
	variant: VariantType,
	{ enqueueSnackbar }: ProviderContext
) => {
	enqueueSnackbar(`${title}: ${message}`, {
		variant: variant,
	});
};

export default CreateNotification;
