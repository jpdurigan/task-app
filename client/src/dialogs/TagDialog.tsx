import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { TagEdit } from "../components/tag/TagEdit";
import { TagNew } from "../components/tag/TagNew";
import { Tag, TagServer } from "../database/Tag";

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
				<TagNew />
				<Divider sx={{ margin: "1em 0" }} />
				{tags.map((tag: Tag) => (
					<TagEdit tag={tag} key={`${tag.id}-${tag.ordering}-${tag.color}`} />
				))}
			</DialogContent>
		</Dialog>
	);
};
