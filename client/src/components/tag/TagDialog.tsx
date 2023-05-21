import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { Tag, TagServer } from "../../database/Tag";
import { EditTag } from "./EditTag";
import { NewTag } from "./NewTag";

interface TagDialogProps {
	isVisible: boolean;
	hide: () => void;
}

export const TagDialog: React.FC<TagDialogProps> = ({ isVisible, hide }) => {
	return (
		<Dialog open={isVisible} onClose={hide}>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				<NewTag />
				<Divider sx={{ margin: "1em 0" }} />
				{TagServer.getAllTags().map((tag: Tag) => (
					<EditTag tag={tag} key={tag.id} />
				))}
			</DialogContent>
		</Dialog>
	);
};
