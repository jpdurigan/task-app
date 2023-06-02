import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	ListItemText,
	MenuItem,
	Select,
	SelectChangeEvent,
	Slide,
	TextField,
} from "@mui/material";
import { AppDialogProps } from "../AppGlobals";
import { Settings } from "@mui/icons-material";
import { Tag } from "../database/Tag";
import { TagStack } from "../tag/TagStack";
import { useEffect, useState } from "react";
import { Task } from "../database/Task";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

const AppTransitionSlideUp = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

interface TaskDialogProps extends AppDialogProps {
	tags?: Tag[];
	editingTask: Task | undefined;
	setEditingTask: (task: Task | undefined) => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
	isVisible,
	hide,
	tags,
	editingTask,
	setEditingTask,
}) => {
	const [taskText, setTaskText] = useState<string>("");
	const [taskTags, setTaskTags] = useState<string[]>([]);

	useEffect(() => {
		setTaskText(editingTask ? editingTask.text : "");
		setTaskTags(editingTask ? editingTask.tags : []);
	}, [editingTask]);

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
		<Dialog
			open={isVisible}
			onClose={onClose}
			maxWidth="xs"
			TransitionComponent={AppTransitionSlideUp}
			fullWidth
		>
			<DialogTitle>Editar tarefa</DialogTitle>
			<DialogContent>
				<TextField
					variant="filled"
					value={taskText}
					onChange={onTextChange}
					multiline
					fullWidth
					hiddenLabel
					rows={3}
					sx={{ mb: 2 }}
				/>
				<Box sx={{ mb: 2 }}>
					<DialogContentText>Etiquetas</DialogContentText>
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
				</Box>
				<FormControlLabel control={<Checkbox />} label="Concluída" />
			</DialogContent>
			<DialogActions>
				<Button>Salvar</Button>
			</DialogActions>
		</Dialog>
	);
};
