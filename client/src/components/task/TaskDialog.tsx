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
import { useState } from "react";
import { Database } from "../../database/Database";
import { exampleTags, Tag, TagServer } from "../../database/Tag";
import { TagStack } from "../tag/TagStack";
import { Task, TaskServer } from "../../database/Task";
import { DialogRemote, Popup } from "../PopupHandler";

interface TaskDialogProps {
	isVisible: boolean;
	hide: () => void;
	task?: Task;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ isVisible, hide, task }) => {
	// const isNewTask = database.editingTask != undefined;
	const [text, setText] = useState<string>(task ? task.text : "");
	const [tags, setTags] = useState<string[]>(
		task ? task.tags : []
	);

	const handleDelete = () => {
		if (!task) return;
		TaskServer.deleteTask(task.id);
	};

	const handleSaving = () => {
		console.log("Got to save", task);
		if (!task) return;
		task.text = text;
		task.tags = tags;
		TaskServer.updateTask(task);
		DialogRemote.hidePopup(Popup.TASK);
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
							<IconButton onClick={() => DialogRemote.showPopup(Popup.TAG)}>
								<Settings fontSize="small" />
							</IconButton>
						</DialogContentText>
						<Select
							fullWidth
							multiple
							value={tags}
							onChange={(e) => {
								const value = e.target.value;
								console.log(`select changed got value: ${value}`);
								const newTagsId: string[] =
									typeof value === "string" ? value.split(",") : value;
								// const newTags: number[] = newTagsId.map((id: string) =>
								// 	parseInt(id)
								// );
								setTags(newTagsId);
							}}
							renderValue={(selected: string[]) => {
								// const tagList: number[] = selected.map((id: string) =>
								// 	parseInt(id)
								// );
								return <TagStack tagList={selected} />;
							}}
						>
							{TagServer.getAllTags().map((tag: Tag) => (
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
