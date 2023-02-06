import { Container, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import "@mui/material/Icon";
import NoteAltIcon from "@mui/icons-material/NoteAlt";

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
					<NoteAltIcon fontSize="inherit" />
					Minhas notas
				</Typography>
			</Box>
		</Container>
	);
};
