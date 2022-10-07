import {
	List,
	Datagrid,
	DeleteButton,
	EditButton,
	TextField,
	DateField,
} from "react-admin";

const ProjectsList: React.FC = () => {
	return (
		<List resource="projects">
			<Datagrid rowClick="show">
				<TextField source="id" label="ID" />
				<TextField source="name" />
				<DateField source="created_at" />
				<EditButton />
				<DeleteButton mutationMode="pessimistic" resource="projects" />
			</Datagrid>
		</List>
	);
};

export default ProjectsList;
