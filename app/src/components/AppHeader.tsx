import { Assignment } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

export const AppHeader: React.FC = () => {
	return (
		<Stack direction="row" alignItems="center" justifyContent="right" my={2}>
			<Assignment sx={{ fontSize: 48 }} color="primary" />
			<Typography variant="h3" component="h1" color="primary">
				Tarefas
			</Typography>
		</Stack>
	);
};
