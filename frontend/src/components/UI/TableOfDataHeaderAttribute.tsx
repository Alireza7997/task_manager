const TableOfDataHeaderAttribute = ({ children }: React.PropsWithChildren) => {
	return (
		<th className="capitalize p-3 border-b-[1px] text-left whitespace-nowrap last:w-[210px]">
			{children}
		</th>
	);
};

export default TableOfDataHeaderAttribute;
