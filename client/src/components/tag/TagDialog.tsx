import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { Tag, TagServer } from "../../database/Tag";
import { EditTag } from "./EditTag";
import { NewTag } from "./NewTag";

interface TagDialogProps {
	show?: boolean;
}

export const TagDialog: React.FC<TagDialogProps> = ({ show = false }) => {
	return (
		<Dialog open={show}>
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
