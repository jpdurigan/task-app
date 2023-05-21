import React, { useEffect, useRef, useState } from "react";
import { TagDialogHandler } from "./components/tag/TagDialog";
import { ThemeApp } from "./components/Theme";
import { Tag, Task } from "./components/Model";
import { HeaderApp } from "./components/HeaderApp";
import { TaskDialogHandler } from "./components/task/TaskDialog";
import { Box } from "@mui/system";
import { Database } from "./components/Database";
import { SpeedDialApp } from "./components/SpeedDialApp";
import { TaskDisplay } from "./components/task/TaskDisplay";
// import "./firebase-config.ts";
import { Auth } from "./components/Auth";
import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebase-config";

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

	useEffect(() => {
		appDatabaseRef.current.loadFromStorage();

		const getAllTasks = async () => {
			try {
				const data = await getDocs(tasksCollectionRef);
				const tasks: Task[] = data.docs.map(doc => {
					const task: Task = {
						id: doc.id,
						text: doc.data()!.text,
						date: doc.data()!.date,
						done: doc.data()!.done,
						tags: doc.data()!.tags,
					}
					return task;
				})
				console.log(tasks);
			} catch (err) {
				console.log(err);
			}
		};
		getAllTasks();
	}, [appDatabaseRef]);
	useEffect(() => {
		appDatabaseRef.current.saveToStorage();
	}, [tasks, tags, appDatabaseRef]);

	return (
		<ThemeApp>
			<Box className="App">
				<HeaderApp />
				<Auth />
				<TaskDisplay database={appDatabase} />
				<TaskDialogHandler database={appDatabase} />
				<TagDialogHandler database={appDatabase} />
				<SpeedDialApp database={appDatabase} />
			</Box>
		</ThemeApp>
	);
};

export default App;
