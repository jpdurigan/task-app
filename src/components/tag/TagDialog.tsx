import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
} from "@mui/material";
import { useState } from "react";
import { exampleTags, Tag } from "../Model";
import { EditTag } from "./EditTag";
import { NewTag } from "./NewTag";
import { ColorGrid, ColorsApp, validColor } from "../Theme";
import { Database } from "../Database";

let selectedColor: validColor = ColorsApp.Blue;

interface TagDialogProps {
	database: Database,
}
export const TagDialog: React.FC<TagDialogProps> = ({database}) => {
	return (
		<Dialog open={true} onClose={() => database.setShowTagsDialog(false)}>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				<NewTag addNewTag={database.addNewTag} tags={database.tags} />
				<Divider sx={{ margin: "1em 0" }} />
				{database.sortTags().map((tag: Tag) => (
					<EditTag
						tag={tag}
						updateTagLabel={database.updateTagLabel}
						updateTagColor={database.updateTagColor}
						moveTag={database.moveTag}
						deleteTag={database.deleteTag}
					/>
				))}
			</DialogContent>
			{/* <DialogActions>
				<Button>Salvar</Button>
			</DialogActions> */}
		</Dialog>
	);
};
