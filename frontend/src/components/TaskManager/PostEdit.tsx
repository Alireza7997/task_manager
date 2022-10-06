import { Edit, SimpleForm, TextInput, DateField, required } from "react-admin";

const PostEdit: React.FC = () => {
	return (
		<Edit>
			<SimpleForm>
				<TextInput source="id" label="ID" disabled />
				<TextInput source="name" validate={[required()]} />
				<DateField source="created_at" />
			</SimpleForm>
		</Edit>
	);
};

export default PostEdit;
