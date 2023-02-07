import {
	ArrowDownward,
	ArrowUpward,
	Circle,
	Delete,
	Edit,
} from "@mui/icons-material";
import {
	Box,
	Button,
	ButtonBase,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	Popover,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useState } from "react";
import { exampleData, exampleTags, Tag } from "./Model";
import { ColorGrid, ColorsApp, ThemeApp, validColor } from "./Theme";

let selectedColor: validColor = ColorsApp.Blue;

export const EditTagsDialog: React.FC = () => {
	const [colorSelectorAnchor, setColorSelectorAnchor] =
		useState<HTMLButtonElement | null>(null);

	return (
		<Dialog open={true}>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				<EditTagOptions
					tag={exampleTags.uni}
					setColorSelectorAnchor={setColorSelectorAnchor}
				/>
				<ColorSelectionPopover
					anchor={colorSelectorAnchor}
					setAnchor={setColorSelectorAnchor}
					setColor={(color) => (selectedColor = color)}
				/>
			</DialogContent>
		</Dialog>
	);
};

interface EditTagOptionsProps {
	tag: Tag;
	setColorSelectorAnchor: React.Dispatch<
		React.SetStateAction<HTMLButtonElement | null>
	>;
}

const EditTagOptions: React.FC<EditTagOptionsProps> = ({
	tag,
	setColorSelectorAnchor,
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [newText, setNewText] = useState<string>(tag.id);
	const [newColor, setNewColor] = useState<validColor>(tag.color);

	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="space-around"
			spacing={1}
			width="100%"
		>
			<Box component="span" display="flex">
				<IconButton>
					<ArrowUpward fontSize="small" />
				</IconButton>
				<IconButton>
					<ArrowDownward fontSize="small" />
				</IconButton>
			</Box>
			{isEditing ? (
				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						setIsEditing(false);
					}}
				>
					<TextField
						variant="standard"
						value={newText}
						onChange={(e) => setNewText(e.target.value)}
					/>
					<IconButton>
						<Delete fontSize="small" />
					</IconButton>
				</Box>
			) : (
				<ButtonBase sx={{ width: "100%" }} onClick={(e) => setIsEditing(true)}>
					<Typography textAlign="left" width="100%">
						{tag.id}
					</Typography>
				</ButtonBase>
			)}

			<ThemeApp color={tag.color}>
				<IconButton
					color="primary"
					onClick={(e) => setColorSelectorAnchor(e.currentTarget)}
				>
					<Circle fontSize="large" />
				</IconButton>
			</ThemeApp>
		</Stack>
	);
};

interface ColorSelectionPopoverProps {
	anchor: HTMLButtonElement | null;
	setAnchor: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
	setColor: (arg0: validColor) => void;
}
const ColorSelectionPopover: React.FC<ColorSelectionPopoverProps> = ({
	anchor,
	setAnchor,
	setColor,
}) => (
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
