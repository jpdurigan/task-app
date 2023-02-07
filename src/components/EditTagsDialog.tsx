import { Circle } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	Popover,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useState } from "react";
import { ColorsApp, ThemeApp, validColor } from "./Theme";

let selectedColor: validColor = ColorsApp.Blue;

export const EditTagsDialog: React.FC = () => {
	const [colorSelectorAnchor, setColorSelectorAnchor] =
		useState<HTMLButtonElement | null>(null);

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
				<ThemeApp color={selectedColor}>
					<IconButton
						color="primary"
						onClick={(e) => setColorSelectorAnchor(e.currentTarget)}
					>
						<Circle fontSize="large" />
					</IconButton>
				</ThemeApp>
				<Popover
					open={colorSelectorAnchor != null}
					anchorEl={colorSelectorAnchor}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					onClose={() => setColorSelectorAnchor(null)}
				>
					<Grid container maxWidth={150}>
						{ColorGrid.map((color) => (
							<Grid item xs={4} key={`color-selector-${color[200]}`}>
								<ThemeApp color={color}>
									<IconButton
										color={color == selectedColor ? "info" : "primary"}
										onClick={(e) => {
											selectedColor = color;
											setColorSelectorAnchor(null);
										}}
									>
										<Circle fontSize="large" />
									</IconButton>
								</ThemeApp>
							</Grid>
						))}
					</Grid>
				</Popover>
			</DialogContent>
		</Dialog>
	);
};
