// =============== Libraries =============== //
import { Admin, fetchUtils, Options, Resource } from "react-admin";
import jsonServerProvider from "ra-data-simple-rest";

// =============== Components =============== //
import TaskManager from "@/components/TaskManager/TaskManager";
import ProjectsList from "@/components/TaskManager/ProjectsList";
import ProjectCreate from "@/components/TaskManager/ProjectCreate";
import PostEdit from "@/components/TaskManager/PostEdit";
import Me from "@/pages/me";
import Logout from "@/pages/logout";

// =============== Icons =============== //
import { TableChart, AccountCircle, MeetingRoom } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "@/store/auth";

const address = process.env.NEXT_PUBLIC_BACKEND
	? process.env.NEXT_PUBLIC_BACKEND
	: "http://127.0.0.1:5000";

const App = () => {
	const auth = useContext(AuthContext);

	const fetchJson = (url: string, options: Options = {}) => {
		if (!options.headers) {
			options.headers = new Headers({ Accept: "application/json" });
		}
		options.headers = new Headers({
			...options.headers,
			jwt: auth.accessToken,
			session_id: auth.sessionID,
		});
		return fetchUtils.fetchJson(url, options);
	};

	return (
		<Admin dataProvider={jsonServerProvider(address, fetchJson)}>
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
