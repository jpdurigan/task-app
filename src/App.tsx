import React, { useEffect, useState } from "react";
import { TagDialogHandler } from "./components/tag/TagDialog";
import { ThemeApp } from "./components/Theme";
import { Tag, Task } from "./components/Model";
import { HeaderApp } from "./components/HeaderApp";
import { TaskDialogHandler } from "./components/task/TaskDialog";
import { Box } from "@mui/system";
import { Database } from "./components/Database";
import { SpeedDialApp } from "./components/SpeedDialApp";
import { TaskDisplay } from "./components/task/TaskDisplay";

const App: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [editingTask, setEditingTask] = useState<number | undefined>();
	const [showTagsDialog, setShowTagsDialog] = useState<boolean>(false);

	const appDatabase = new Database(
		tasks,
		setTasks,
		tags,
		setTags,
		editingTask,
		setEditingTask,
		showTagsDialog,
		setShowTagsDialog
	);

	useEffect(() => {
		console.log("use effect []");
		appDatabase.loadFromStorage();
	}, []);
	useEffect(() => {
		console.log("use effect [tasks, tags]");
		appDatabase.saveToStorage();
	}, [tasks, tags]);

	return (
		<ThemeApp>
			<Box className="App">
				<HeaderApp />
				<TaskDisplay database={appDatabase} />
				<TaskDialogHandler database={appDatabase} />
				<TagDialogHandler database={appDatabase} />
				<SpeedDialApp database={appDatabase} />
			</Box>
		</ThemeApp>
	);
};

export default App;
