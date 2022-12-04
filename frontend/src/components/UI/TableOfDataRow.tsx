// =============== Libraries =============== //
import Button from "@mui/material/Button";

// =============== Components =============== //
import TableOfDataRowAttribute from "./TableOfDataRowAttribute";

interface TableOfDataRow extends React.PropsWithChildren {
	value: any;
	onDeleteClick: (value: any) => void;
	onEditClick: (value: any) => void;
	onClick: (value: any) => void;
}

const TableOfDataRow = (props: TableOfDataRow) => {
	return (
		<tr
			className="border-t-[1px] border-t-[#818895] first:border-t-none last:border-b-[3px] last:border-b-[#FFFFFF] cursor-pointer transition-[background-color] hover:bg-[#1565C0]"
			onClick={() => props.onClick(props.value)}
		>
			{props.children}
			<TableOfDataRowAttribute>
				<Button
					variant="contained"
					color="error"
					className="bg-rose-500"
					onClick={(e) => {
						e.stopPropagation();
						props.onDeleteClick(props.value);
					}}
				>
					Delete
				</Button>
				<Button
					variant="contained"
					color="info"
					className="flex-grow bg-slate-700"
					onClick={(e) => {
						e.stopPropagation();
						props.onEditClick(props.value);
					}}
				>
					Edit
				</Button>
			</TableOfDataRowAttribute>
		</tr>
	);
};

export default TableOfDataRow;
