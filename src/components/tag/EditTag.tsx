import {
	ArrowUpward,
	ArrowDownward,
	Delete,
	Circle,
} from "@mui/icons-material";
import {
	Stack,
	Box,
	IconButton,
	TextField,
	ButtonBase,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Tag } from "../Model";
import { validColor, ThemeApp } from "../Theme";
import { ColorSelectionPopover } from "./ColorSelectionPopover";

interface EditTagProps {
	tag: Tag;
	updateTagLabel: (id: number, label: string) => void;
	updateTagColor: (id: number, color: validColor) => void;
	moveTag: (id: number, move: 1 | -1) => void;
	deleteTag: (id: number) => void;
}

export const EditTag: React.FC<EditTagProps> = ({
	tag,
	updateTagLabel,
	updateTagColor,
	moveTag,
	deleteTag,
	// setColorSelectorAnchor,
}) => {
	const [isEditingLabel, setIsEditingLabel] = useState<boolean>(false);
	const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
		null
	);
	// const [newLabel, setNewLabel] = useState<string>(tag.label);
	// const [newColor, setNewColor] = useState<validColor>(tag.color);

	const handleMoveUp = () => {
		moveTag(tag.id, -1);
		closeEditingLabel();
	};

	const handleMoveDown = () => {
		moveTag(tag.id, +1);
		closeEditingLabel();
	};

	const handleUpdateLabel = (label: string) => {
		updateTagLabel(tag.id, label);
		// setNewLabel(label);
	};

	const handleUpdateColor = (color: validColor) => {
		updateTagColor(tag.id, color);
		// setNewColor(color);
	};

	const handleDelete = () => {
		deleteTag(tag.id);
	};

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
						value={tag.label}
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
				currentColor={tag.color}
				setNewColor={handleUpdateColor}
			/>
		</Stack>
	);
};
