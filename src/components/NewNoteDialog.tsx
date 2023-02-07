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
import { exampleTags, knownTags, Tag } from "./Model";
import { ColorsApp, ThemeApp } from "./Theme";

const TagFromId = (id: string) => {
	return knownTags.find((t: Tag) => t.id == parseInt(id)) as Tag;
};

export const NewNoteDialog: React.FC = () => {
	const [text, setText] = useState<string>("");
	const [tags, setTags] = useState<Tag[]>([]);
	const tagsAsValue = ():string[] => tags.map((t: Tag) => (t.id).toString())

	return (
		<Dialog open={true}>
			<DialogTitle>Nova nota</DialogTitle>
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
							Adicionar tags
						</DialogContentText>
						<Select
							fullWidth
							multiple
							value={tagsAsValue()}
							onChange={(e) => {
								const value = e.target.value;
								const newTagsId: string[] =
									typeof value === "string" ? value.split(",") : value;
								const newTags: Tag[] = newTagsId.map((id) => TagFromId(id));
								setTags(newTags);
							}}
							renderValue={(selected: string[]) => (
								<Box display="flex" gap={1}>
									{selected.map((id: string) => (
										<ThemeApp color={TagFromId(id).color}>
											<Chip
												label={TagFromId(id).label}
												key={`new-note-selected-tag-${id}`}
												color="primary"
											/>
										</ThemeApp>
									))}
								</Box>
							)}
						>
							{knownTags.map((tag: Tag) => (
								<MenuItem value={tag.id} key={`new-note-tag-${tag.id}`}>
									<ListItemText primary={tag.label} />
								</MenuItem>
							))}
						</Select>
					</Box>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button>Cancelar</Button>
				<Button>Salvar</Button>
			</DialogActions>
		</Dialog>
	);
};
