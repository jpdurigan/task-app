import { Circle } from "@mui/icons-material";
import { Popover, Grid, IconButton } from "@mui/material";
import { validColor, ColorGrid, ThemeApp } from "../Theme";

interface ColorSelectionPopoverProps {
	anchor: HTMLButtonElement | null;
	setAnchor: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
	currentColor: validColor;
	setNewColor: (newColor: validColor) => void;
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
			{ColorGrid.map((color) => (
				<Grid item xs={4} key={color[200]}>
					<ThemeApp color={color}>
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
