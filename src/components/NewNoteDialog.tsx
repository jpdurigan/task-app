import {
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	List,
	ListItem,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";

const knownTags = ["tag1", "tag2", "tag3"];

export const NewNoteDialog: React.FC = () => {
	const [text, setText] = useState<string>("");
	const [tags, setTags] = useState<string[]>([]);

	return (
		<Dialog open={true}>
			<DialogTitle>New note</DialogTitle>
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
						<DialogContentText>Tags</DialogContentText>
						<Select
							fullWidth
							multiple
							value={tags}
							onChange={(e) => {
								const value = e.target.value;
								const newTags: string[] =
									typeof value === "string" ? value.split(",") : value;
								setTags(newTags);
							}}
							renderValue={(selected: string[]) => (
								<Box>
									{selected.map((tag: string) => (
										<Chip label={tag} key={`new-note-selected-tag-${tag}`} />
									))}
								</Box>
							)}
						>
							{knownTags.map((tag: string) => (
								<MenuItem value={tag} key={`new-note-tag-${tag}`}>
									{tag}
								</MenuItem>
							))}
						</Select>
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button>Cancel</Button>
				<Button>Save</Button>
			</DialogActions>
		</Dialog>
	);
};
