import {
	Save,
	Edit,
	ArrowUpward,
	ArrowDownward,
	Circle,
	Delete,
} from "@mui/icons-material";
import {
	Stack,
	IconButton,
	TextField,
	Popper,
	Collapse,
	Card,
	ButtonGroup,
	Button,
	useTheme,
	useMediaQuery,
	Box,
} from "@mui/material";
import { MouseEventHandler, useState } from "react";
import { TagColors } from "../Theme";
import { Tag, TagServer } from "../database/Tag";

interface TagDialogEditProps {
	tag: Tag;
	updateTag: (tag: Tag, updateAll?: boolean) => void;
	deleteTag: (tag: Tag) => void;
}

export const TagDialogEdit: React.FC<TagDialogEditProps> = ({
	tag,
	updateTag,
	deleteTag,
}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isColorPopperOpen, setIsColorPopperOpen] = useState<boolean>(false);
	const [colorPopperAnchor, setColorPopperAnchor] =
		useState<HTMLElement | null>(null);

	const [tagLabel, setTagLabel] = useState<string>(tag.label);
	const [tagColor, setTagColor] = useState<TagColors>(tag.color);

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down("sm"));

	const onEditClick = () => {
		if (isEditing) {
			const newTag = TagServer.getClone(tag);
			newTag.label = tagLabel;
			updateTag(newTag);
		}
		setIsEditing((current) => !current);
	};

	const onUpwardClick = () => {
		const newTag = TagServer.getClone(tag);
		newTag.ordering -= 3;
		updateTag(newTag, true);
	};

	const onDownwardClick = () => {
		const newTag = TagServer.getClone(tag);
		newTag.ordering += 3;
		updateTag(newTag, true);
	};

	const onColorClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setColorPopperAnchor(event.currentTarget);
		setIsColorPopperOpen((current) => !current);
	};

	const onColorChange = (color: TagColors) => {
		setTagColor(color);
		setIsColorPopperOpen(false);

		const newTag = TagServer.getClone(tag);
		newTag.color = color;
		updateTag(newTag);
	};

	const onDeleteClick = () => {
		deleteTag(tag);
	};

	const onLabelChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setTagLabel(event.target.value);
	};

	return (
		<Stack direction="row" gap={1} alignItems="center">
			<IconButton onClick={onEditClick}>
				{isEditing ? <Save color={tagColor} /> : <Edit />}
			</IconButton>
			{matches ? (
				<>
					<Stack width="100%">
						<Box>
							<IconButton onClick={onUpwardClick}>
								<ArrowUpward color={isEditing ? tagColor : "disabled"} />
							</IconButton>
							<IconButton onClick={onDownwardClick}>
								<ArrowDownward color={isEditing ? tagColor : "disabled"} />
							</IconButton>
							<IconButton onClick={onColorClick}>
								<Circle color={tagColor} />
							</IconButton>
							<IconButton onClick={onDeleteClick} disabled={!isEditing}>
								<Delete color={isEditing ? tagColor : "disabled"} />
							</IconButton>
						</Box>
						<TextField
							size="small"
							color={tagColor}
							fullWidth
							value={tagLabel}
							disabled={!isEditing}
							onChange={onLabelChange}
						/>
					</Stack>
				</>
			) : (
				<>
					<IconButton onClick={onUpwardClick}>
						<ArrowUpward color={isEditing ? tagColor : "disabled"} />
					</IconButton>
					<IconButton onClick={onDownwardClick}>
						<ArrowDownward color={isEditing ? tagColor : "disabled"} />
					</IconButton>
					<TextField
						size="small"
						color={tagColor}
						fullWidth
						value={tagLabel}
						disabled={!isEditing}
						onChange={onLabelChange}
					/>
					<IconButton onClick={onColorClick}>
						<Circle color={tagColor} />
					</IconButton>
					<IconButton onClick={onDeleteClick} disabled={!isEditing}>
						<Delete color={isEditing ? tagColor : "disabled"} />
					</IconButton>
				</>
			)}
			<TagColorPopper
				open={isColorPopperOpen}
				anchorEl={colorPopperAnchor}
				currentColor={tagColor}
				onColorChange={onColorChange}
			/>
		</Stack>
	);
};

interface TagColorPopper {
	open: boolean;
	anchorEl: HTMLElement | null;
	currentColor: TagColors;
	onColorChange: (color: TagColors) => void;
}

const TagColorPopper: React.FC<TagColorPopper> = ({
	open,
	anchorEl,
	currentColor,
	onColorChange,
}) => {
	const AllColors = Object.values(TagColors);

	return (
		<Popper
			open={open}
			anchorEl={anchorEl}
			placement="bottom-end"
			transition
			keepMounted
			sx={{ zIndex: 1301 }}
		>
			{({ TransitionProps }) => (
				<Collapse {...TransitionProps}>
					<Card>
						<ButtonGroup orientation="vertical">
							{AllColors.map((color) => (
								<Button
									disabled={color === currentColor}
									color={color}
									key={color}
									variant="contained"
									sx={{ minHeight: 36 }}
									onClick={() => onColorChange(color)}
								/>
							))}
						</ButtonGroup>
					</Card>
				</Collapse>
			)}
		</Popper>
	);
};
