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
import { AppDialogs } from "./AppDialogs";
import { Task, exampleTasks } from "./database/Task";
import { TaskBox } from "./task/TaskBox";
import { TaskDialog } from "./task/TaskDialog";

export const App: React.FC = () => {
	const [tags, setTags] = useState<Tag[]>([]);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [dialog, setDialog] = useState<AppDialogs>(AppDialogs.NONE);

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				try {
					// const newTags = await TagServer.loadRemote();
					// setTags(newTags ? newTags : []);
					setTags(exampleTags);
					setTasks(exampleTasks);
				} catch (err) {
					console.log(err);
				}
			} else {
				setTags([]);
			}
		});
	}, []);

	return (
		<AppThemeProvider>
			<Container maxWidth="xs">
				<AppHeader />
				<AppToolbar showDialog={setDialog} allTags={tags} />
				<Stack spacing={2} mb={4}>
					{tasks.map((task) => (
						<TaskBox
							text={task.text}
							tagIds={task.tags}
							done={task.done}
							key={task.id}
							tags={tags}
						/>
					))}
				</Stack>
			</Container>
			<AuthDialog
				isVisible={dialog === AppDialogs.AUTH}
				hide={() => {
					setDialog(AppDialogs.NONE);
				}}
			/>
			<TagDialog
				isVisible={dialog === AppDialogs.TAGS}
				hide={() => {
					setDialog(AppDialogs.NONE);
				}}
				tags={tags}
			/>
			<TaskDialog
				isVisible={dialog === AppDialogs.TASK}
				hide={() => {
					setDialog(AppDialogs.NONE);
				}}
				tags={tags}
			/>
		</AppThemeProvider>
	);
};
