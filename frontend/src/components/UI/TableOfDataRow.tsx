// =============== Components =============== //
import TableOfDataRowAttribute from "./TableOfDataRowAttribute";
import InputGlassmorphismForm from "@/components/UI/InputGlassmorphismForm";

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
				<InputGlassmorphismForm
					type="button"
					label="delete"
					className="transition-[background-color] bg-[#D32F2F] active:bg-[#C62828] text-white py-[6px] px-[16px] font-thin uppercase"
					onClick={(e) => {
						e.stopPropagation();
						props.onDeleteClick(props.value);
					}}
				></InputGlassmorphismForm>
				<InputGlassmorphismForm
					type="button"
					label="edit"
					className="transition-[background-color] bg-slate-700 active:bg-slate-800 text-white py-[6px] px-[16px] font-thin uppercase"
					parentClassName="flex-grow"
					onClick={(e) => {
						e.stopPropagation();
						props.onEditClick(props.value);
					}}
				></InputGlassmorphismForm>
			</TableOfDataRowAttribute>
		</tr>
	);
};

export default TableOfDataRow;
