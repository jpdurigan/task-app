import {
	Alert,
	Button,
	Collapse,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { AppHeader } from "./components/AppHeader";
import { AppToolbar } from "./components/AppToolbar";
import { AppThemeProvider } from "./Theme";
import { Tag, TagServer, exampleTags } from "./database/Tag";
import { TagDialog } from "./tag/TagDialog";
import { AuthDialog } from "./auth/AuthDialog";
import { useCallback, useEffect, useState } from "react";
import {
	auth,
	getUserFromURL,
	isReadOnly,
	isUserAuthorized,
} from "./database/Firebase";
import { AppDialogs, AppFilterDone } from "./AppGlobals";
import { Task, TaskServer, exampleTasks } from "./database/Task";
import { TaskCard } from "./task/TaskCard";
import { TaskDialog } from "./task/TaskDialog";
import { AddCircleOutline } from "@mui/icons-material";
import { ShareDialog } from "./share/ShareDialog";
import { useTranslation } from "react-i18next";

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

	const { t } = useTranslation();

	useEffect(() => {
		const hasTaskWithNoTag = tasks.some((task) => {
			return task.tags.length == 0;
		});
		if (hasTaskWithNoTag) {
			setWarning("APP_WARNING_TASK_NO_TAG");
			return;
		}

		setWarning(undefined);
	}, [tasks]);

	useEffect(() => {
		if (
			!isUserAuthorized() &&
			!isReadOnly() &&
			(tags.length > 0 || tasks.length > 0)
		) {
			setWarning("APP_WARNING_LOCAL_MODE");
		}
	}, [tags, tasks]);

	useEffect(() => {
		if (getUserFromURL() !== null) {
			loadAllFromDatabase();
		}
	}, []);

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
			TaskServer.saveAllRemote(newTasks);
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

	const deleteAll = useCallback(async () => {
		await TaskServer.deleteAllRemote(tasks);
		TaskServer.saveLocal([]);
		await TagServer.deleteAllRemote(tags);
		TagServer.saveLocal([]);
	}, [tags, tasks]);

	const onPopulateWithExamples = () => {
		setTags(exampleTags);
		TagServer.saveAllRemote(exampleTags);
		TagServer.saveLocal(exampleTags);

		setTasks(exampleTasks);
		TaskServer.saveAllRemote(exampleTasks);
		TaskServer.saveLocal(exampleTasks);

		setFilterTags(exampleTags.map((tag) => tag.id));
	};

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				await loadAllFromDatabase();
			} else {
				setTags([]);
				TagServer.saveLocal([]);
				setTasks([]);
				TaskServer.saveLocal([]);
				setFilterTags([]);
			}
		});
	}, []);

	const loadAllFromDatabase = async () => {
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
	};

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
						{t(warning!)}
					</Alert>
				</Collapse>
				{isLoading && <Typography mb={2}>{t("APP_LABEL_LOADING")}</Typography>}
				{!isLoading && tags.length == 0 && tasks.length == 0 && (
					<Button
						variant="contained"
						color="secondary"
						startIcon={<AddCircleOutline />}
						onClick={onPopulateWithExamples}
						fullWidth
					>
						{t("APP_LABEL_ADD_EXAMPLES")}
					</Button>
				)}
				<Stack spacing={2} mb={4}>
					{filteredTasks.map((task) => (
						<TaskCard
							text={task.text}
							tagIds={task.tags}
							done={task.done}
							key={task.id}
							tags={tags}
							onClick={() => {
								if (isReadOnly()) return;
								setEditingTask(task);
								setDialog(AppDialogs.TASK);
							}}
						/>
					))}
				</Stack>
			</Container>
			<AuthDialog
				isVisible={dialog === AppDialogs.AUTH}
				hide={hideDialog}
				deleteAll={deleteAll}
			/>
			<ShareDialog isVisible={dialog === AppDialogs.SHARE} hide={hideDialog} />
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
