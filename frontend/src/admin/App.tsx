import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-simple-rest";
import TaskManager from "@/components/TaskManager/TaskManager";
import ProjectsList from "@/components/TaskManager/ProjectsList";
import ProjectCreate from "@/components/TaskManager/ProjectCreate";
import PostEdit from "@/components/TaskManager/PostEdit";
import { GlobalContext } from "@/store/global";
import { useContext } from "react";

const App = () => {
	const globals = useContext(GlobalContext);

	return (
		<Admin dataProvider={jsonServerProvider(globals.backend)}>
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
};

export default App;
