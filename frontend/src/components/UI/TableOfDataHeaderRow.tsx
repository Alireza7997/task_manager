// =============== Components =============== //
import TableOfDataHeaderAttribute from "./TableOfDataHeaderAttribute";

const TableOfDataHeaderRow = ({ children }: React.PropsWithChildren) => {
	return (
		<tr>
			{children}
			<TableOfDataHeaderAttribute>Actions</TableOfDataHeaderAttribute>
		</tr>
	);
};

export default TableOfDataHeaderRow;
