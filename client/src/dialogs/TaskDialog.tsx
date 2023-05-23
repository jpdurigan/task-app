import { Settings } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	ListItemText,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { Tag, TagServer } from "../database/Tag";
import { TagStack } from "../components/tag/TagStack";
import { Task, TaskServer } from "../database/Task";
import { DialogRemote, DialogApp } from "./DialogHandler";
import { DataContext, Data } from "../database/DataProvider";

interface TaskDialogProps {
	isVisible: boolean;
	hide: () => void;
	task?: Task;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ isVisible, hide, task }) => {
	const { tags } = useContext(DataContext) as Data;
	const [text, setText] = useState<string>(task ? task.text : "");
	const [taskTags, setTaskTags] = useState<string[]>(
		task ? task.tags : []
	);

	useEffect(() => console.log(tags), [tags]);

	const handleDelete = () => {
		if (!task) return;
		TaskServer.deleteTask(task.id);
	};

	const handleSaving = () => {
		if (!task) return;
		task.text = text;
		task.tags = taskTags;
		TaskServer.updateTask(task);
		DialogRemote.hideDialog(DialogApp.TASK);
	};

	return (
		<Dialog open={isVisible} onClose={hide}>
			<DialogTitle>Editar nota</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				<Stack spacing={2}>
					<Box>
						<TextField
							hiddenLabel
							fullWidth
							multiline
							minRows={3}
							variant="filled"
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
					</Box>
					<Box>
						<DialogContentText variant="body2">
							Tags
							<IconButton onClick={() => DialogRemote.showDialog(DialogApp.TAG)}>
								<Settings fontSize="small" />
							</IconButton>
						</DialogContentText>
						<Select
							fullWidth
							multiple
							value={taskTags}
							onChange={(e) => {
								const value = e.target.value;
								const newTagsId: string[] =
									typeof value === "string" ? value.split(",") : value;
								setTaskTags(newTagsId);
							}}
							renderValue={(selected: string[]) => {
								return <TagStack tagList={selected} />;
							}}
						>
							{tags.value.map((tag: Tag) => (
								<MenuItem value={tag.id.toString()} key={tag.id}>
									<ListItemText primary={tag.label} />
								</MenuItem>
							))}
						</Select>
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDelete}>Apagar</Button>
				<Button onClick={handleSaving}>Salvar</Button>
			</DialogActions>
		</Dialog>
	);
};
