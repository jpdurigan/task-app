import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	ListItemText,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import { AppDialogProps } from "../AppDialogs";
import { Settings } from "@mui/icons-material";
import { Tag } from "../database/Tag";
import { TagStack } from "../tag/TagStack";
import { useState } from "react";
import { Task } from "../database/Task";

interface TaskDialogProps extends AppDialogProps {
	tags?: Tag[];
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
	isVisible,
	hide,
	tags,
}) => {
	const [editingTask, setEditingTask] = useState<Task>();
	const [taskText, setTaskText] = useState<string>("");
	const [taskTags, setTaskTags] = useState<string[]>([]);

	const onTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setTaskText(event.target.value);
	};

	const onTagsChange = (event: SelectChangeEvent<string[]>) => {
		const value = event.target.value;
		const newTagsId: string[] =
			typeof value === "string" ? value.split(",") : value;
		setTaskTags(newTagsId);
	};

	const tagsRenderValue = (selected: string[]) => {
		const selectedTags: Tag[] = selected.map((tagId) =>
			tags?.find((tag) => tag.id === tagId)
		) as Tag[];
		return <TagStack tags={selectedTags} />;
	};

	const onClose = () => {
		setEditingTask(undefined);
		hide();
	};

	return (
		<Dialog open={isVisible} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle>Editar task</DialogTitle>
			<DialogContent>
				<TextField
					variant="filled"
					onChange={onTextChange}
					multiline
					fullWidth
					hiddenLabel
					rows={3}
					sx={{ mb: 2 }}
				/>
				<DialogContentText>Tags</DialogContentText>
				<Select
					fullWidth
					multiple
					value={taskTags}
					onChange={onTagsChange}
					renderValue={tagsRenderValue}
				>
					{tags &&
						tags.map((tag: Tag) => (
							<MenuItem value={tag.id.toString()} key={tag.id}>
								<ListItemText primary={tag.label} />
							</MenuItem>
						))}
				</Select>
			</DialogContent>
			<DialogActions>
				<Button>Salvar</Button>
			</DialogActions>
		</Dialog>
	);
};
