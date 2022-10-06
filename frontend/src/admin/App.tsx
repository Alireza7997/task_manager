import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-simple-rest";
import TaskManager from "@/components/TaskManager/TaskManager";
import ProjectsList from "@/components/TaskManager/ProjectsList";
import ProjectCreate from "@/components/TaskManager/ProjectCreate";
import PostEdit from "@/components/TaskManager/PostEdit";

const dataProvider = jsonServerProvider(
	process.env.NEXT_PUBLIC_BACKEND
		? process.env.NEXT_PUBLIC_BACKEND
		: "http://127.0.0.1:5000"
);

const App = () => (
	<Admin dataProvider={dataProvider}>
		<Resource
			name="projects"
			// show={TaskManager}
			list={ProjectsList}
			create={ProjectCreate}
			edit={PostEdit}
			show={TaskManager}
		/>
	</Admin>
);

export default App;
