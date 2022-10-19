// =============== Libraries =============== //
import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-simple-rest";
import { useContext } from "react";
import { GrProjects } from "react-icons/gr";

// =============== Components =============== //
import TaskManager from "@/components/TaskManager/TaskManager";
import ProjectsList from "@/components/TaskManager/ProjectsList";
import ProjectCreate from "@/components/TaskManager/ProjectCreate";
import PostEdit from "@/components/TaskManager/PostEdit";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

const App = () => {
	const globals = useContext(GlobalContext);

	return (
		<Admin dataProvider={jsonServerProvider(globals.backend)}>
			<Resource
				name="projects"
				list={ProjectsList}
				create={ProjectCreate}
				edit={PostEdit}
				show={TaskManager}
				icon={GrProjects}
				options={{ label: "Task Manager" }}
				recordRepresentation={(record) => " - " + record.name}
			/>
		</Admin>
	);
};

export default App;
