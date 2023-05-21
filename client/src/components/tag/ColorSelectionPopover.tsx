import { Circle } from "@mui/icons-material";
import { Popover, Grid, IconButton } from "@mui/material";
import {
	ValidColor,
	PaletteGrid,
	ThemeApp,
	Palette,
} from "../../database/Theme";

interface ColorSelectionPopoverProps {
	anchor: HTMLButtonElement | null;
	setAnchor: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
	currentColor: ValidColor;
	setNewColor: (newColor: ValidColor) => void;
}

export const ColorSelectionPopover: React.FC<ColorSelectionPopoverProps> = ({
	anchor,
	setAnchor,
	currentColor,
	setNewColor,
}) => (
	<Popover
		open={anchor != null}
		anchorEl={anchor}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "right",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "right",
		}}
		onClose={() => setAnchor(null)}
	>
		<Grid container maxWidth={150}>
			{PaletteGrid.map((color) => (
				<Grid item xs={4} key={color}>
					<ThemeApp color_name={color}>
						<IconButton
							color={color === currentColor ? "info" : "primary"}
							onClick={(e) => {
								setNewColor(color);
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
