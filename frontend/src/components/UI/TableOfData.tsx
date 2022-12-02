// =============== Components =============== //
import TableOfDataHeaderAttribute from "./TableOfDataHeaderAttribute";
import TableOfDataHeaderRow from "./TableOfDataHeaderRow";
import TableOfDataRow from "./TableOfDataRow";
import TableOfDataRowAttribute from "./TableOfDataRowAttribute";

// =============== Types =============== //
import Project from "@/types/project";

interface TableOfDataProps {
	headerList: string[];
	list: any[];
}

const TableOfData = ({ headerList, list }: TableOfDataProps) => {
	return (
		<table className="w-full bg-slate-600 rounded-t-lg">
			<thead>
				<TableOfDataHeaderRow>
					{headerList.map((value) =>
						value !== "user_id" ? (
							<TableOfDataHeaderAttribute key={value}>
								{value}
							</TableOfDataHeaderAttribute>
						) : null
					)}
				</TableOfDataHeaderRow>
			</thead>
			<tbody className="bg-[#4F617A]">
				{list.map((item) => (
					<TableOfDataRow key={item.id}>
						{headerList.map((key, i) =>
							key !== "user_id" ? (
								<TableOfDataRowAttribute key={i}>
									{item[key]}
								</TableOfDataRowAttribute>
							) : null
						)}
					</TableOfDataRow>
				))}
			</tbody>
		</table>
	);
};

export default TableOfData;
