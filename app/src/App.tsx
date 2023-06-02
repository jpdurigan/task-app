import {
	Alert,
	Card,
	CardActionArea,
	CardContent,
	Collapse,
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

const initialTags = () => TagServer.loadLocal();
const initialTasks = () => TaskServer.loadLocal();
const initialFilterTags = () => initialTags().map((tag) => tag.id);

export const App: React.FC = () => {
	const [tags, setTags] = useState<Tag[]>(initialTags);
	const [tasks, setTasks] = useState<Task[]>(initialTasks);

	const [dialog, setDialog] = useState<AppDialogs>(AppDialogs.NONE);
	const [filterDone, setFilterDone] = useState<AppFilterDone>(
		AppFilterDone.ALL
	);
	const [filterTags, setFilterTags] = useState<string[]>(initialFilterTags);
	const [editingTask, setEditingTask] = useState<Task>();

	const [warning, setWarning] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const hasTaskWithNoTag = tasks.some((task) => {
			return task.tags.length == 0;
		});
		if (hasTaskWithNoTag) {
			setWarning(
				"Você tem tarefas sem etiquetas. Para acessá-las, desmarque todas as opções no filtro de tags."
			);
			return;
		}

		setWarning(undefined);
	}, [tags]);

	const createTag = useCallback(
		(tag: Tag) => {
			const newTags = [...tags, tag];
			setTags(newTags);
			TagServer.saveOneRemote(tag);
			TagServer.saveLocal(newTags);

			const newFilterTags = [...filterTags, tag.id];
			setFilterTags(newFilterTags);
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
		(tagUpdated: Tag, updateAll: boolean = false) => {
			if (updateAll) {
				const newTags = TagServer.normalizeOrdering(
					tags.map(
						(tag: Tag): Tag => (tag.id === tagUpdated.id ? tagUpdated : tag)
					)
				);
				setTags(newTags);
				TagServer.saveAllRemote(newTags);
				TagServer.saveLocal(newTags);
			} else {
				const newTags = tags.map(
					(tag: Tag): Tag => (tag.id === tagUpdated.id ? tagUpdated : tag)
				);
				setTags(newTags);
				TagServer.saveOneRemote(tagUpdated);
				TagServer.saveLocal(newTags);
			}
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

			const newTasks = TaskServer.normalizeTags(tasks, newTags);
			setTasks(newTasks);
			TaskServer.saveLocal(newTasks);
			TaskServer.saveLocal(newTasks);

			const validTags: string[] = newTags.map((tag) => tag.id);
			const newFilterTags = filterTags.filter((tagId) =>
				validTags.includes(tagId)
			);
			setFilterTags(newFilterTags);
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

	const filteredTasks = TaskServer.filterByTags(
		tasks,
		filterTags,
		filterDone,
		tags
	);

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
				<Collapse in={warning !== undefined}>
					<Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
						{warning}
					</Alert>
				</Collapse>
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
				createTag={createTag}
				updateTag={updateTag}
				deleteTag={deleteTag}
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
