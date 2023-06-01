import {
	Card,
	CardActionArea,
	CardContent,
	Container,
	Typography,
} from "@mui/material";
import { AppHeader } from "./components/AppHeader";
import { AppToolbar } from "./components/AppToolbar";
import { AppThemeProvider } from "./Theme";
import { TagStack } from "./tag/TagStack";
import { Tag, TagServer } from "./database/Tag";
import { TagDialog } from "./tag/TagDialog";
import { AuthDialog } from "./auth/AuthDialog";
import { useEffect, useState } from "react";
import { auth } from "./database/Firebase";
import { AppDialogs } from "./AppDialogs";

export const App: React.FC = () => {
	const [tags, setTags] = useState<Tag[]>();
	const [dialog, setDialog] = useState<AppDialogs>(AppDialogs.NONE);

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			if (user) {
				try {
					const newTags = await TagServer.loadRemote();
					setTags(newTags);
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
				<AppToolbar showDialog={setDialog} />
				<Card>
					<CardActionArea>
						<CardContent>
							<TagStack tags={tags ? tags : []} />
							<Typography variant="h6">Descrição da tarefa</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</Container>
			<TagDialog
				isVisible={dialog === AppDialogs.TAGS}
				hide={() => {
					setDialog(AppDialogs.NONE);
				}}
			/>
			<AuthDialog
				isVisible={dialog === AppDialogs.AUTH}
				hide={() => {
					setDialog(AppDialogs.NONE);
				}}
			/>
		</AppThemeProvider>
	);
};
