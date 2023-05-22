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
import { Tag, TagServer } from "../../database/Tag";
import { ValidColor, ThemeApp } from "../../database/Theme";
import { TagColorSelection } from "./TagColorSelection";

interface TagEditProps {
	tag: Tag;
	// onChange: () => void;
}

export const TagEdit: React.FC<TagEditProps> = ({ tag }) => {
	const [isEditingLabel, setIsEditingLabel] = useState<boolean>(false);
	const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
		null
	);

	const handleMoveUp = () => {
		TagServer.moveTag(tag.id, -1);
		closeEditingLabel();
		// onChange();
	};

	const handleMoveDown = () => {
		TagServer.moveTag(tag.id, +1);
		closeEditingLabel();
		// onChange();
	};

	const handleUpdateLabel = (label: string) => {
		TagServer.updateTagLabel(tag.id, label);
	};

	const handleUpdateColor = (color: ValidColor) => {
		TagServer.updateTagColor(tag.id, color);
		// onChange();
	};

	const handleDelete = () => {
		TagServer.deleteTag(tag.id);
		// onChange();
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
			width="400px"
		>
			<Box component="span" display="flex">
				<IconButton onClick={handleMoveUp}>
					<ArrowUpward fontSize="small" />
				</IconButton>
				<IconButton onClick={handleMoveDown}>
					<ArrowDownward fontSize="small" />
				</IconButton>
			</Box>
			<ThemeApp color_name={tag.color}>
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
			{isEditingLabel ? (
				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						closeEditingLabel();
					}}
					sx={{ width: "100%" }}
				>
					<TextField
						variant="standard"
						value={tag.label}
						onChange={(e) => handleUpdateLabel(e.target.value)}
						onBlur={(e) => closeEditingLabel()}
						fullWidth
					/>
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

			<IconButton onClick={handleDelete}>
				<Delete />
			</IconButton>

			<TagColorSelection
				anchor={popoverAnchor}
				setAnchor={setPopoverAnchor}
				currentColor={tag.color}
				setNewColor={handleUpdateColor}
			/>
		</Stack>
	);
};
