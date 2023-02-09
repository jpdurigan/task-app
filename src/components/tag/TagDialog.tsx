import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { Tag } from "../Model";
import { EditTag } from "./EditTag";
import { NewTag } from "./NewTag";
import { Database } from "../Database";

interface TagDialogProps {
	database: Database;
}

const TagDialog: React.FC<TagDialogProps> = ({ database }) => {
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
		</Dialog>
	);
};

export const TagDialogHandler: React.FC<TagDialogProps> = ({ database }) =>
	database.showTagsDialog ? <TagDialog database={database} /> : <></>;
