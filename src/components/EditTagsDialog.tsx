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
import { ColorGrid, ColorsApp, ThemeApp, validColor } from "./Theme";

let selectedColor: validColor = ColorsApp.Blue;

export const EditTagsDialog: React.FC = () => {
	const [colorSelectorAnchor, setColorSelectorAnchor] =
		useState<HTMLButtonElement | null>(null);

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
				<ColorSelectionPopover anchor={colorSelectorAnchor} setAnchor={setColorSelectorAnchor} setColor={(color) => selectedColor = color} />
			</DialogContent>
		</Dialog>
	);
};

interface ColorSelectionPopoverProps {
	anchor: HTMLButtonElement | null,
	setAnchor: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>,
	setColor: (arg0: validColor) => void;
}
const ColorSelectionPopover: React.FC<ColorSelectionPopoverProps> = ({anchor, setAnchor, setColor}) => (
	<Popover
		open={anchor != null}
		anchorEl={anchor}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "left",
		}}
		onClose={() => setAnchor(null)}
	>
		<Grid container maxWidth={150}>
			{ColorGrid.map((color) => (
				<Grid item xs={4} key={`color-selector-${color[200]}`}>
					<ThemeApp color={color}>
						<IconButton
							color={color == selectedColor ? "info" : "primary"}
							onClick={(e) => {
								setColor(color);
								setAnchor(null);
							}}
						>
							<Circle fontSize="large" />
						</IconButton>
					</ThemeApp>
				</Grid>
			))}
		</Grid>
	</Popover>
);
