import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { Tag, TagServer } from "../../database/Tag";
import { EditTag } from "./EditTag";
import { NewTag } from "./NewTag";
import { useEffect, useState } from "react";

interface TagDialogProps {
	isVisible: boolean;
	hide: () => void;
	// tags: Tag[];
}

export const TagDialog: React.FC<TagDialogProps> = ({ isVisible, hide }) => {
	const [rerenders, setRerenders] = useState<number>(0);

	const forceRender = ():void => setRerenders(rerenders + 1);

	return (
		<Dialog open={isVisible} onClose={hide}>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				<NewTag />
				<Divider sx={{ margin: "1em 0" }} />
				{TagServer.getAllTags().map((tag: Tag) => (
					<EditTag tag={tag} key={`${tag.ordering}-${tag.id}`} onChange={forceRender} />
				))}
			</DialogContent>
		</Dialog>
	);
};
