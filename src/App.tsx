import React, { useState } from "react";
import { TagDialogHandler } from "./components/tag/TagDialog";
import { ThemeApp } from "./components/Theme";
import { exampleData, exampleTags, Tag, Task } from "./components/Model";
import { HeaderApp } from "./components/HeaderApp";
import { TaskDialogHandler } from "./components/task/TaskDialog";
import { Box } from "@mui/system";
import { Database } from "./components/Database";
import { SpeedDialApp } from "./components/SpeedDialApp";
import { TaskDisplay } from "./components/task/TaskDisplay";

const App: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>(exampleData);
	const [tags, setTags] = useState<Tag[]>(exampleTags);
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
