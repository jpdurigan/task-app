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
import { Task, TaskServer } from "../database/Task";
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
	allTags?: Tag[];
	editingTask: Task | undefined;
	setEditingTask: (task: Task | undefined) => void;
	createTask: (task: Task) => void;
	updateTask: (task: Task) => void;
	deleteTask: (task: Task) => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
	isVisible,
	hide,
	allTags,
	editingTask,
	setEditingTask,
	createTask,
	updateTask,
	deleteTask,
}) => {
	const [taskText, setTaskText] = useState<string>("");
	const [taskTags, setTaskTags] = useState<string[]>([]);
	const [taskDone, setTaskDone] = useState<boolean>(false);

	useEffect(() => {
		setTaskText(editingTask ? editingTask.text : "");
		setTaskTags(editingTask ? editingTask.tags : []);
		setTaskDone(editingTask ? editingTask.done : false);
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
			allTags?.find((tag) => tag.id === tagId)
		) as Tag[];
		return <TagStack tags={selectedTags} />;
	};

	const onDoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTaskDone(event.target.checked);
	};

	const onSaveClicked = () => {
		const isTaskValid = taskText.length > 0;
		if (!isTaskValid) return;

		const isNewTask = editingTask === undefined;
		if (isNewTask) {
			const newTask = TaskServer.getNewTask();
			newTask.text = taskText;
			newTask.tags = taskTags;
			newTask.done = taskDone;
			createTask(newTask);
			onClose();
		} else {
			const newTask = TaskServer.getClone(editingTask);
			newTask.text = taskText;
			newTask.tags = taskTags;
			newTask.done = taskDone;
			updateTask(newTask);
			onClose();
		}
	};

	const onDeleteClicked = () => {
		const isNewTask = editingTask === undefined;
		if (isNewTask) return;

		deleteTask(editingTask);
		onClose();
	};

	const onClose = () => {
		setEditingTask(undefined);
		setTaskText("");
		setTaskTags([]);
		setTaskDone(false);
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
						{allTags &&
							allTags.map((tag: Tag) => (
								<MenuItem value={tag.id.toString()} key={tag.id}>
									<ListItemText primary={tag.label} />
								</MenuItem>
							))}
					</Select>
				</Box>
				<FormControlLabel
					control={<Checkbox checked={taskDone} onChange={onDoneChange} />}
					label="Concluída"
				/>
			</DialogContent>
			<DialogActions>
				{editingTask !== undefined && (
					<Button color="error" onClick={onDeleteClicked}>
						Apagar
					</Button>
				)}
				<Button onClick={onSaveClicked}>Salvar</Button>
			</DialogActions>
		</Dialog>
	);
};
