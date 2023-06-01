import { Assignment } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

export const AppHeader: React.FC = () => {
	return (
		<Stack direction="row" alignItems="center" justifyContent="right">
			<Assignment sx={{ fontSize: 48 }} />
			<Typography variant="h3" component="h1">
				Tarefas
			</Typography>
		</Stack>
	);
};
