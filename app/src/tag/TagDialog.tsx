import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
} from "@mui/material";
import { Tag, TagServer } from "../database/Tag";
import { AppDialogProps } from "../AppGlobals";
import { useTranslation } from "react-i18next";
import { TagDialogEdit } from "./TagDialogEdit";

interface TagDialogProps extends AppDialogProps {
	allTags?: Tag[];
	createTag: (tag: Tag) => void;
	updateTag: (tag: Tag, updateAll?: boolean) => void;
	deleteTag: (tag: Tag) => void;
}

export const TagDialog: React.FC<TagDialogProps> = ({
	isVisible,
	hide,
	allTags,
	createTag,
	updateTag,
	deleteTag,
}) => {
	const { t } = useTranslation();

	const onNewTagClick = () => {
		const newTag = TagServer.getNewTag();
		createTag(newTag);
	}
	
	return (
		<Dialog open={isVisible} onClose={hide} maxWidth="xs" fullWidth>
			<DialogTitle>{t("APP_TAG_TITLE")}</DialogTitle>
			<DialogContent>
				<Stack gap={1}>
					{allTags &&
						allTags.map((tag) => (
							<TagDialogEdit
								tag={tag}
								updateTag={updateTag}
								deleteTag={deleteTag}
								key={tag.id}
							/>
						))}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onNewTagClick}>{t("APP_TAG_ACTIONS_NEW_TAG")}</Button>
			</DialogActions>
		</Dialog>
	);
};
