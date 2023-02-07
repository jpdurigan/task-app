import { Circle } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
} from "@mui/material";
import { spacing } from "@mui/system";
import { ColorsApp, ThemeApp, validColor } from "./Theme";

export const EditTagsDialog: React.FC = () => {
	const ColorGrid: validColor[] = [
		ColorsApp.Red,
		ColorsApp.Pink,
		ColorsApp.Purple,
		ColorsApp.Indigo,
		ColorsApp.Blue,
		ColorsApp.Teal,
		ColorsApp.Green,
		ColorsApp.Yellow,
		ColorsApp.Orange,
	];

	return (
		<Dialog open={true}>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				<Grid container maxWidth={150}>
					{ColorGrid.map((color) => (
						<Grid item xs={4}>
							<ThemeApp color={color}>
								<IconButton color="primary">
									<Circle fontSize="large" />
								</IconButton>
							</ThemeApp>
						</Grid>
					))}
				</Grid>
			</DialogContent>
		</Dialog>
	);
};
