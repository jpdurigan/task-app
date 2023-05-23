import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { TagEdit } from "../components/tag/TagEdit";
import { TagNew } from "../components/tag/TagNew";
import { Tag, TagServer } from "../database/Tag";
import { Data, DataContext } from "../database/DataProvider";

interface TagDialogProps {
	isVisible: boolean;
	hide: () => void;
}

export const TagDialog: React.FC<TagDialogProps> = ({ isVisible, hide }) => {
	const { tags } = useContext(DataContext) as Data;

	return (
		<Dialog open={isVisible} onClose={hide}>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				<TagNew />
				<Divider sx={{ margin: "1em 0" }} />
				{tags.value.map((tag: Tag) => (
					<TagEdit tag={tag} key={`${tag.id}-${tag.ordering}-${tag.color}`} />
				))}
			</DialogContent>
		</Dialog>
	);
};
