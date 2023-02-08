import {
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	ListItemText,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import { Database } from "../Database";
import { exampleTags, Tag } from "../Model";
import { TagStack } from "../tag/TagStack";
import { ColorsApp, ThemeApp } from "../Theme";

interface TaskDialogProps {
	database: Database;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({ database }) => {
	const isNewTask = database.editingTask === -1;
	const [text, setText] = useState<string>(
		isNewTask ? "" : database.getTask(database.editingTask as number).text
	);
	const [tags, setTags] = useState<number[]>(
		isNewTask ? [] : database.getTask(database.editingTask as number).tags
	);
	const tagsAsValue = (): string[] => tags.map((id: number) => id.toString());

	const handleDelete = () => {
		database.deleteTask(database.editingTask as number);
		database.setEditingTask(undefined);
	};

	const handleSaving = () => {
		if (isNewTask) database.addNewTask(text, tags);
		else database.updateTask(database.editingTask as number, text, tags);
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
						<DialogContentText variant="body2">Tags</DialogContentText>
						<Select
							fullWidth
							multiple
							value={tagsAsValue()}
							onChange={(e) => {
								const value = e.target.value;
								console.log(`select changed got value: ${value}`);
								const newTagsId: string[] =
									typeof value === "string" ? value.split(",") : value;
								const newTags: number[] = newTagsId.map((id: string) =>
									parseInt(id)
								);
								setTags(newTags);
							}}
							renderValue={(selected: string[]) => {
								const tagList: number[] = selected.map((id: string) =>
									parseInt(id)
								);
								return <TagStack tagList={tagList} database={database} />;
							}}
						>
							{exampleTags.map((tag: Tag) => (
								<MenuItem
									value={tag.id.toString()}
									key={`task-dialog-select-tag-${tag.id}`}
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
