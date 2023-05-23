import { Box } from "@mui/material";
import { HeaderApp } from "./components/HeaderApp";
import { UserTasks } from "./components/UserTasks";
import { ThemeApp } from "./database/Theme";
import { DialogHandler } from "./dialogs/DialogHandler";
import { DataProvider } from "./database/DataProvider";

const App: React.FC = () => {
	return (
		<DataProvider>
			<ThemeApp>
				<Box className="App">
					<HeaderApp />
					<UserTasks />
					<DialogHandler />
				</Box>
			</ThemeApp>
		</DataProvider>
	);
};

export default App;
