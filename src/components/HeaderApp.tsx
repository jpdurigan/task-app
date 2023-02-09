import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import "@mui/material/Icon";
import { Assignment } from "@mui/icons-material";

export const HeaderApp: React.FC = () => {
	return (
		<Container component="header">
			<Box
				minHeight="150px"
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Typography
					variant="h2"
					component="h1"
					align="center"
					display="contents"
				>
					<Assignment fontSize="inherit" color="primary" />
					Tarefas
				</Typography>
			</Box>
		</Container>
	);
};
