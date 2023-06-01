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
import { exampleTags } from "./database/Tag";
import { TagDialog } from "./tag/TagDialog";

export const App: React.FC = () => {
	return (
    <AppThemeProvider>
			<Container maxWidth="xs">
				<AppHeader />
				<AppToolbar />
				<Card>
					<CardActionArea>
						<CardContent>
							<TagStack tags={exampleTags} />
							<Typography variant="h6">Descrição da tarefa</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</Container>
			<TagDialog />
    </AppThemeProvider>
	);
};
