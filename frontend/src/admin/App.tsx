// =============== Libraries =============== //
import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-simple-rest";
import { useContext } from "react";

// =============== Components =============== //
import TaskManager from "@/components/TaskManager/TaskManager";
import ProjectsList from "@/components/TaskManager/ProjectsList";
import ProjectCreate from "@/components/TaskManager/ProjectCreate";
import PostEdit from "@/components/TaskManager/PostEdit";
import Me from "@/pages/me";
import Logout from "@/pages/logout";

// =============== Stores =============== //
import { GlobalContext } from "@/store/global";

// =============== Icons =============== //
import { TableChart, AccountCircle, MeetingRoom } from "@mui/icons-material";

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
				icon={TableChart}
				options={{ label: "Task Manager" }}
				recordRepresentation={(record) => " - " + record.name}
			/>
			<Resource
				name="me"
				list={Me}
				icon={AccountCircle}
				options={{ label: "Profile" }}
			/>
			<Resource
				name="logout"
				icon={MeetingRoom}
				list={Logout}
				options={{ label: "Logout" }}
			/>
		</Admin>
	);
};

export default App;
