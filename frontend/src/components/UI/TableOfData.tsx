// =============== Libraries =============== //
import moment from "moment";

// =============== Components =============== //
import TableOfDataHeaderAttribute from "./TableOfDataHeaderAttribute";
import TableOfDataHeaderRow from "./TableOfDataHeaderRow";
import TableOfDataRow from "./TableOfDataRow";
import TableOfDataRowAttribute from "./TableOfDataRowAttribute";

interface TableOfDataProps {
	headerList: string[];
	list: any[];
	onDeleteClick: (value: any) => void;
	onEditClick: (value: any) => void;
	onClick: (value: any) => void;
}

const TableOfData = (props: TableOfDataProps) => {
	return (
		<table className="w-full bg-slate-600 rounded-t-lg">
			<thead>
				<TableOfDataHeaderRow>
					{props.headerList.map((value) =>
						value !== "user_id" ? (
							<TableOfDataHeaderAttribute key={value}>
								{value === "id" ? "ID" : value.replaceAll("_", " ")}
							</TableOfDataHeaderAttribute>
						) : null
					)}
				</TableOfDataHeaderRow>
			</thead>
			<tbody className="bg-[#4F617A]">
				{props.list.map((item) => (
					<TableOfDataRow
						key={item.id}
						onDeleteClick={props.onDeleteClick}
						onEditClick={props.onEditClick}
						onClick={props.onClick}
						value={item}
					>
						{props.headerList.map((key, i) =>
							key !== "user_id" ? (
								<TableOfDataRowAttribute key={i}>
									{item[key] instanceof Date
										? moment(item[key]).format("YYYY-MM-DD") === "0001-01-01"
											? "----------------"
											: moment(item[key]).format("YYYY-MM-DD")
										: item[key]}
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
