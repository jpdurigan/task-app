import {
	Button,
	ButtonGroup,
	Card,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Popper,
	Stack,
	TextField,
} from "@mui/material";
import { Tag, TagServer } from "../database/Tag";
import {
	ArrowDownward,
	ArrowUpward,
	Circle,
	Delete,
	Edit,
	Save,
} from "@mui/icons-material";
import { TagColors } from "../Theme";
import { useState } from "react";
import { AppDialogProps } from "../AppGlobals";

interface TagDialogProps extends AppDialogProps {
	allTags?: Tag[];
	createTag: (tag: Tag) => void;
	updateTag: (tag: Tag, updateAll?: boolean) => void;
	deleteTag: (tag: Tag) => void;
}

export const TagDialog: React.FC<TagDialogProps> = ({
	isVisible,
	hide,
	allTags,
	createTag,
	updateTag,
	deleteTag,
}) => {
	const onNewTagClick = () => {
		const newTag = TagServer.getNewTag();
		createTag(newTag);
	}
	
	return (
		<Dialog open={isVisible} onClose={hide} maxWidth="xs" fullWidth>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent>
				<Stack gap={1}>
					{allTags &&
						allTags.map((tag) => (
							<TagDialogEdit
								tag={tag}
								updateTag={updateTag}
								deleteTag={deleteTag}
								key={tag.id}
							/>
						))}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onNewTagClick}>Adicionar nova tag</Button>
			</DialogActions>
		</Dialog>
	);
};

interface TagDialogEditProps {
	tag: Tag;
	updateTag: (tag: Tag, updateAll?: boolean) => void;
	deleteTag: (tag: Tag) => void;
}

const TagDialogEdit: React.FC<TagDialogEditProps> = ({
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

	const AllColors = Object.values(TagColors);

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
		<Stack direction="row" gap={1}>
			<IconButton onClick={onEditClick}>
				{isEditing ? <Save color={tagColor} /> : <Edit />}
			</IconButton>
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
			<Popper
				open={isColorPopperOpen}
				anchorEl={colorPopperAnchor}
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
										disabled={color === tagColor}
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
		</Stack>
	);
};
