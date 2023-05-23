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
import { useContext, useState } from "react";
import { Tag, TagServer } from "../../database/Tag";
import { ValidColor, ThemeApp } from "../../database/Theme";
import { TagColorSelection } from "./TagColorSelection";
import { DataContext, Data } from "../../database/DataProvider";

interface TagEditProps {
	tag: Tag;
	// onChange: () => void;
}

export const TagEdit: React.FC<TagEditProps> = ({ tag }) => {
	const { tags } = useContext(DataContext) as Data;
	const [isEditingLabel, setIsEditingLabel] = useState<boolean>(false);
	const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(
		null
	);

	const handleMoveUp = () => {
		tag.ordering += -1;
		tags.update(tag);
		closeEditingLabel();
	};

	const handleMoveDown = () => {
		tag.ordering += +1;
		tags.update(tag);
		closeEditingLabel();
	};

	const handleUpdateLabel = (label: string) => {
		tag.label = label;
		tags.update(tag);
	};

	const handleUpdateColor = (color: ValidColor) => {
		tag.color = color;
		tags.update(tag);
	};

	const handleDelete = () => {
		tags.destroy(tag);
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
