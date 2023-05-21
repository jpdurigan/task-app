import React, { useEffect, useRef, useState } from "react";
import { TagDialog } from "./components/tag/TagDialog";
import { ThemeApp } from "./database/Theme";

import { HeaderApp } from "./components/HeaderApp";
import { TaskDialogHandler } from "./components/task/TaskDialog";
import { Box } from "@mui/system";
import { Database } from "./database/Database";
import { SpeedDialApp } from "./components/SpeedDialApp";
import { TaskDisplay } from "./components/task/TaskDisplay";
// import "./firebase-config.ts";
import { AuthDialog } from "./database/Auth";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./database/Firebase";
import { Tag, TagServer } from "./database/Tag";
import { Task } from "./database/Task";

const App: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);
	const [editingTask, setEditingTask] = useState<string | undefined>();
	const [showTagsDialog, setShowTagsDialog] = useState<boolean>(false);

	const tasksCollectionRef = collection(db, "tasks");

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
	const appDatabaseRef = useRef(appDatabase);

	TagServer.init(tags, setTags);
	
	useEffect(() => {
		TagServer.saveToStorage();
	}, [tags]);

	return (
		<ThemeApp>
			<Box className="App">
				<HeaderApp />
				<AuthDialog />
				<TaskDisplay database={appDatabase} />
				<TaskDialogHandler database={appDatabase} />
				<TagDialog show={showTagsDialog} />
				<SpeedDialApp database={appDatabase} />
			</Box>
		</ThemeApp>
	);
};

export default App;
