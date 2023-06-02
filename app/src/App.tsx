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
import { useCallback, useEffect, useState } from "react";
import { auth, hasFirebaseUser } from "./database/Firebase";
import { AppDialogs, AppFilterDone } from "./AppGlobals";
import { Task, TaskServer, exampleTasks } from "./database/Task";
import { TaskCard } from "./task/TaskCard";
import { TaskDialog } from "./task/TaskDialog";

export const App: React.FC = () => {
	const initialTags = TagServer.loadLocal();
	console.log("tags", initialTags);
	const initialTasks = TaskServer.loadLocal();
	console.log("tasks", initialTasks);
	const initialFilterTags = initialTags.map((tag) => tag.id);
	const [tags, setTags] = useState<Tag[]>(initialTags);
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [dialog, setDialog] = useState<AppDialogs>(AppDialogs.NONE);
	const [filterDone, setFilterDone] = useState<AppFilterDone>(
		AppFilterDone.ALL
	);
	const [filterTags, setFilterTags] = useState<string[]>(initialFilterTags);
	const [editingTask, setEditingTask] = useState<Task>();

	const createTag = useCallback(
		(tag: Tag) => {
			const newTags = [...tags, tag];
			setTags(newTags);
			TagServer.saveOneRemote(tag);
			TagServer.saveLocal(newTags);
		},
		[tags]
	);

	const createTask = useCallback(
		(task: Task) => {
			const newTasks = [...tasks, task];
			setTasks(newTasks);
			TaskServer.saveOneRemote(task);
			TaskServer.saveLocal(newTasks);
		},
		[tasks]
	);

	const updateTag = useCallback(
		(tagUpdated: Tag) => {
			const newTags = tags.map(
				(tag: Tag): Tag => (tag.id === tagUpdated.id ? tagUpdated : tag)
			);
			setTags(newTags);
			TagServer.saveOneRemote(tagUpdated);
			TagServer.saveLocal(newTags);
		},
		[tags]
	);

	const updateTask = useCallback(
		(taskUpdated: Task) => {
			const newTasks = tasks.map(
				(task: Task): Task => (task.id === taskUpdated.id ? taskUpdated : task)
			);
			setTasks(newTasks);
			TaskServer.saveOneRemote(taskUpdated);
			TaskServer.saveLocal(newTasks);
		},
		[tasks]
	);

	const deleteTag = useCallback(
		(tagToDestroy: Tag) => {
			const newTags = TagServer.normalizeOrdering(
				tags.filter((tag) => tag.id !== tagToDestroy.id)
			);
			setTags(newTags);
			TagServer.deleteOneRemote(tagToDestroy);
			TagServer.saveLocal(newTags);
		},
		[tags]
	);

	const deleteTask = useCallback(
		(taskToDestroy: Task) => {
			const newTasks = tasks.filter((task) => task.id !== taskToDestroy.id);
			setTasks(newTasks);
			TaskServer.deleteOneRemote(taskToDestroy);
			TaskServer.saveLocal(newTasks);
		},
		[tasks]
	);

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				setIsLoading(true);
				try {
					const newTags = await TagServer.loadRemote();
					const newTasks = await TaskServer.loadRemote();

					if (newTags && newTasks) {
						setTags(newTags);
						TagServer.saveLocal(newTags);
						setTasks(newTasks);
						TaskServer.saveLocal(newTasks);
						setFilterTags(newTags.map((tag) => tag.id));
					} else {
						setTags([]);
						setTasks([]);
						setFilterTags([]);
					}
				} catch (err) {
					console.log(err);
				}
				setIsLoading(false);
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
				{isLoading && <Typography mb={2}>Carregando...</Typography>}
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
				allTags={tags}
			/>
			<TaskDialog
				isVisible={dialog === AppDialogs.TASK}
				hide={hideDialog}
				allTags={tags}
				editingTask={editingTask}
				setEditingTask={setEditingTask}
				createTask={createTask}
				updateTask={updateTask}
				deleteTask={deleteTask}
			/>
		</AppThemeProvider>
	);
};
