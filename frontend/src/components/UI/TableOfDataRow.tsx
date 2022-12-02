// =============== Libraries =============== //
import Button from "@mui/material/Button";

// =============== Components =============== //
import TableOfDataRowAttribute from "./TableOfDataRowAttribute";

const TableOfDataRow = ({ children }: React.PropsWithChildren) => {
	return (
		<tr className="border-t-[1px] border-t-[#818895] first:border-t-none last:border-b-[3px] last:border-b-[#FFFFFF] cursor-pointer transition-[background-color] hover:bg-[#1565C0]">
			{children}
			<TableOfDataRowAttribute>
				<Button variant="contained" color="error" className="bg-rose-500">
					Delete
				</Button>
				<Button
					variant="contained"
					color="info"
					className="flex-grow bg-slate-700"
				>
					Edit
				</Button>
			</TableOfDataRowAttribute>
		</tr>
	);
};

export default TableOfDataRow;
