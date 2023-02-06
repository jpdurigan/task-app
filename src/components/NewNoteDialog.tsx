import {
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import { ColorsApp, ThemeApp } from "./Theme";

const knownTags = ["tag1", "tag2", "tag3"];

export const NewNoteDialog: React.FC = () => {
	const [text, setText] = useState<string>("");
	const [tags, setTags] = useState<string[]>([]);
	// const classes = useStyles();

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
										<ThemeApp color={ColorsApp.Purple}>
											<Chip label={tag} key={`new-note-selected-tag-${tag}`} color="primary" />
										</ThemeApp>
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
