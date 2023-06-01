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

export const App: React.FC = () => {
	return (
		<>
			<Container maxWidth="xs">
				<AppHeader />
				<AppToolbar />
				<Card>
					<CardActionArea>
						<CardContent>
							<Stack direction="row" justifyContent="flex-end" gap={1}>
								<Chip label="Tag 1" size="small" />
								<Chip label="Tag 2" size="small" />
							</Stack>
							<Typography variant="h6">Descrição da tarefa</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</Container>
		</>
	);
};
