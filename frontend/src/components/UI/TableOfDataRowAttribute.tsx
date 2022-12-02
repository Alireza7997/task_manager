const TableOfDataRowAttribute = ({ children }: React.PropsWithChildren) => {
	return (
		<td className="px-3 py-2 whitespace-nowrap last:space-x-2 last:flex">
			{children}
		</td>
	);
};

export default TableOfDataRowAttribute;
