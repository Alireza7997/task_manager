import {
	Create,
	SimpleForm,
	TextInput,
	DateField,
	required,
} from "react-admin";

const ProjectCreate: React.FC = () => {
	return (
		<Create redirect="/projects">
			<SimpleForm>
				<TextInput source="name" validate={[required()]} />
				<DateField source="created_at" />
			</SimpleForm>
		</Create>
	);
};

export default ProjectCreate;
