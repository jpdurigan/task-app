import { Box } from "@mui/material";
import { HeaderApp } from "./components/HeaderApp";
import { UserTasks } from "./components/UserTasks";
import { ThemeApp } from "./database/Theme";
import { DialogHandler } from "./dialogs/DialogHandler";

const App: React.FC = () => {

	return (
		<ThemeApp>
			<Box className="App">
				<HeaderApp />
				<UserTasks />
				<DialogHandler />
			</Box>
		</ThemeApp>
	);
};

export default App;
