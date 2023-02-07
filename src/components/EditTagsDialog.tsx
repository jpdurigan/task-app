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
import { exampleData, exampleTags, knownTags, Tag } from "./Model";
import { ColorGrid, ColorsApp, ThemeApp, validColor } from "./Theme";

let selectedColor: validColor = ColorsApp.Blue;

export const EditTagsDialog: React.FC = () => {
	const [tags, setTags] = useState<Tag[]>(knownTags);

	const getTag = (id: number): Tag => tags.find(tag => tag.id === id) as Tag;

	const updateTagLabel = (id: number, label: string): void => {
		let newTag = {...getTag(id)} as Tag;
		newTag.label = label;

		let newTags = tags.map(tag => tag.id === id ? newTag : tag);
		setTags(newTags);
	};

	const updateTagColor = (id: number, color: validColor): void => {
		let newTag = {...getTag(id)} as Tag;
		newTag.color = color;
		
		let newTags = tags.map(tag => tag.id === id ? newTag : tag);
		setTags(newTags);
	};

	return (
		<Dialog open={true}>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				{tags.map((tag: Tag) => (
					<EditTagOptions tag={tag} updateTagLabel={updateTagLabel} updateTagColor={updateTagColor} />
				))}
			</DialogContent>
		</Dialog>
	);
};

interface EditTagOptionsProps {
	tag: Tag;
	// setColorSelectorAnchor: React.Dispatch<
	// 	React.SetStateAction<HTMLButtonElement | null>
	// >;
	updateTagLabel: (id: number, label: string) => void;
	updateTagColor: (id: number, color: validColor) => void;
}

const EditTagOptions: React.FC<EditTagOptionsProps> = ({
	tag,
	updateTagLabel,
	updateTagColor,
	// setColorSelectorAnchor,
}) => {
	const [isEditingLabel, setIsEditingLabel] = useState<boolean>(false);
	const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
		null
	);
	const [newLabel, setNewLabel] = useState<string>(tag.label);
	const [newColor, setNewColor] = useState<validColor>(tag.color);

	const handleMoveUp = () => {
		closeEditingLabel();
	};

	const handleMoveDown = () => {
		closeEditingLabel();
	};

	const handleUpdateLabel = (label: string) => {
		updateTagLabel(tag.id, label);
		setNewLabel(label);
	};

	const handleUpdateColor = (color: validColor) => {
		updateTagColor(tag.id, color);
		setNewColor(color);
	};

	const handleDelete = () => {};

	const closeEditingLabel = () => {
		if (isEditingLabel) setIsEditingLabel(false);
	};

	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="space-around"
			spacing={1}
			width="100%"
		>
			<Box component="span" display="flex">
				<IconButton onClick={handleMoveUp}>
					<ArrowUpward fontSize="small" />
				</IconButton>
				<IconButton onClick={handleMoveDown}>
					<ArrowDownward fontSize="small" />
				</IconButton>
			</Box>
			{isEditingLabel ? (
				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						closeEditingLabel();
					}}
				>
					<TextField
						variant="standard"
						value={newLabel}
						onChange={(e) => handleUpdateLabel(e.target.value)}
						onBlur={(e) => closeEditingLabel()}
					/>
					<IconButton onClick={handleDelete}>
						<Delete fontSize="small" />
					</IconButton>
				</Box>
			) : (
				<ButtonBase
					sx={{ width: "100%" }}
					onClick={() => setIsEditingLabel(true)}
				>
					<Typography textAlign="left" width="100%">
						{tag.label}
					</Typography>
				</ButtonBase>
			)}

			<ThemeApp color={tag.color}>
				<IconButton
					color="primary"
					onClick={(e) => {
						closeEditingLabel();
						setPopoverAnchor(e.currentTarget);
					}}
				>
					<Circle fontSize="large" />
				</IconButton>
			</ThemeApp>

			<ColorSelectionPopover
				anchor={popoverAnchor}
				setAnchor={setPopoverAnchor}
				setColor={handleUpdateColor}
			/>
		</Stack>
	);
};

interface ColorSelectionPopoverProps {
	anchor: HTMLButtonElement | null;
	setAnchor: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
	setColor: (newColor: validColor) => void;
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
