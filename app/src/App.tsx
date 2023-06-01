import {
	Card,
	CardActionArea,
	CardContent,
	Chip,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { AppHeader } from "./components/AppHeader";
import { AppToolbar } from "./components/AppToolbar";
import { AppThemeProvider } from "./Theme";

export const App: React.FC = () => {
	return (
    <AppThemeProvider>
			<Container maxWidth="xs">
				<AppHeader />
				<AppToolbar />
				<Card>
					<CardActionArea>
						<CardContent>
							<Stack direction="row" justifyContent="flex-end" gap={1}>
								<Chip label="Tag 1" size="small" color="blue" />
								<Chip label="Tag 2" size="small" color="teal" />
								<Chip label="Tag 3" size="small" color="green" />
								<Chip label="Tag 4" size="small" color="yellow" />
								<Chip label="Tag 5" size="small" color="red" />
								<Chip label="Tag 6" size="small" color="pink" />
								<Chip label="Tag 7" size="small" color="purple" />
							</Stack>
							<Typography variant="h6">Descrição da tarefa</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</Container>
    </AppThemeProvider>
	);
};
