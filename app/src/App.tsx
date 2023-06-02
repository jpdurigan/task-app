import {
	Card,
	CardActionArea,
	CardContent,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { AppHeader } from "./components/AppHeader";
import { AppToolbar } from "./components/AppToolbar";
import { AppThemeProvider } from "./Theme";
import { TagStack } from "./tag/TagStack";
import { Tag, TagServer, exampleTags } from "./database/Tag";
import { TagDialog } from "./tag/TagDialog";
import { AuthDialog } from "./auth/AuthDialog";
import { useEffect, useState } from "react";
import { auth } from "./database/Firebase";
import { AppDialogs, AppFilterDone } from "./AppGlobals";
import { Task, TaskServer, exampleTasks } from "./database/Task";
import { TaskCard } from "./task/TaskCard";
import { TaskDialog } from "./task/TaskDialog";

export const App: React.FC = () => {
	const [tags, setTags] = useState<Tag[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);

	const [dialog, setDialog] = useState<AppDialogs>(AppDialogs.NONE);
	const [filterDone, setFilterDone] = useState<AppFilterDone>(
		AppFilterDone.ALL
	);
	const [filterTags, setFilterTags] = useState<string[]>([]);
	const [editingTask, setEditingTask] = useState<Task>();

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				try {
					// const newTags = await TagServer.loadRemote();
					// setTags(newTags ? newTags : []);
					setTags(exampleTags);
					setTasks(exampleTasks);
					setFilterTags(exampleTags.map((tag) => tag.id));
				} catch (err) {
					console.log(err);
				}
			} else {
				setTags([]);
			}
		});
	}, []);

	const hideDialog = () => {
		setDialog(AppDialogs.NONE);
	};

	const filteredTasks = TaskServer.filterByTags(tasks, filterTags, filterDone);

	return (
		<AppThemeProvider>
			<Container maxWidth="xs">
				<AppHeader />
				<AppToolbar
					showDialog={setDialog}
					allTags={tags}
					filterDone={filterDone}
					setFilterDone={setFilterDone}
					filterTags={filterTags}
					setFilterTags={setFilterTags}
				/>
				<Stack spacing={2} mb={4}>
					{filteredTasks.map((task) => (
						<TaskCard
							text={task.text}
							tagIds={task.tags}
							done={task.done}
							key={task.id}
							tags={tags}
							onClick={() => {
								setEditingTask(task);
								setDialog(AppDialogs.TASK);
							}}
						/>
					))}
				</Stack>
			</Container>
			<AuthDialog isVisible={dialog === AppDialogs.AUTH} hide={hideDialog} />
			<TagDialog
				isVisible={dialog === AppDialogs.TAGS}
				hide={hideDialog}
				tags={tags}
			/>
			<TaskDialog
				isVisible={dialog === AppDialogs.TASK}
				hide={hideDialog}
				tags={tags}
				editingTask={editingTask}
				setEditingTask={setEditingTask}
			/>
		</AppThemeProvider>
	);
};
