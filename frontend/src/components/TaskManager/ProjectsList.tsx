import {
	List,
	Datagrid,
	TextField,
	DateField,
	DeleteButton,
	EditButton,
	ShowButton,
} from "react-admin";

const ProjectsList: React.FC = () => {
	return (
		<List resource="projects">
			<Datagrid>
				<TextField source="id" label="ID" />
				<TextField source="name" />
				<DateField source="created_at" />
				<ShowButton />
				<EditButton />
				<DeleteButton resource="projects" />
			</Datagrid>
		</List>
	);
};

export default ProjectsList;
