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
import { exampleTags, Tag } from "../../database/Model";
import { TagStack } from "../tag/TagStack";

interface TaskDialogProps {
	database: Database;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ database }) => {
	const isNewTask = database.editingTask != undefined;
	const [text, setText] = useState<string>(
		isNewTask ? "" : database.getTask(database.editingTask as string).text
	);
	const [tags, setTags] = useState<string[]>(
		isNewTask ? [] : database.getTask(database.editingTask as string).tags
	);

	const handleDelete = () => {
		database.deleteTask(database.editingTask as string);
		database.setEditingTask(undefined);
	};

	const handleSaving = () => {
		if (isNewTask) database.addNewTask(text, tags);
		else database.updateTask(database.editingTask as string, text, tags);
		database.setEditingTask(undefined);
	};

	return (
		<Dialog open={true} onClose={() => database.setEditingTask(undefined)}>
			<DialogTitle>{isNewTask ? "Criar nova nota" : "Editar nota"}</DialogTitle>
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
							<IconButton onClick={() => database.setShowTagsDialog(true)}>
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
								return <TagStack tagList={selected} database={database} />;
							}}
						>
							{exampleTags.map((tag: Tag) => (
								<MenuItem
									value={tag.id.toString()}
									key={tag.id}
								>
									<ListItemText primary={tag.label} />
								</MenuItem>
							))}
						</Select>
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions>
				{isNewTask ? <></> : <Button onClick={handleDelete}>Apagar</Button>}
				<Button onClick={handleSaving}>Salvar</Button>
			</DialogActions>
		</Dialog>
	);
};

export const TaskDialogHandler: React.FC<TaskDialogProps> = ({ database }) =>
	database.showTaskDialog() ? <TaskDialog database={database} /> : <></>;
