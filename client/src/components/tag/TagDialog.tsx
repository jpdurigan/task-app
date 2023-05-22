import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { Tag, TagServer } from "../../database/Tag";
import { EditTag } from "./EditTag";
import { NewTag } from "./NewTag";
import { useEffect, useState } from "react";

interface TagDialogProps {
	isVisible: boolean;
	hide: () => void;
}

export const TagDialog: React.FC<TagDialogProps> = ({ isVisible, hide }) => {
	const [tags, setTags] = useState<Tag[]>([]);

	useEffect(() => {
		TagServer.init(tags, setTags);
	}, []);

	useEffect(() => {
		TagServer.updateTags(tags);
		console.log("useEffect TAGS ", tags);
	}, [tags]);

	return (
		<Dialog open={isVisible} onClose={hide}>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				<NewTag />
				<Divider sx={{ margin: "1em 0" }} />
				{tags.map((tag: Tag) => (
					<EditTag tag={tag} key={`${tag.id}-${tag.ordering}-${tag.color}`} />
				))}
			</DialogContent>
		</Dialog>
	);
};
