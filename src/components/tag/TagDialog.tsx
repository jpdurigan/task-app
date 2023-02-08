import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
} from "@mui/material";
import { useState } from "react";
import { knownTags, Tag } from "../Model";
import { EditTag } from "./EditTag";
import { NewTag } from "./NewTag";
import { ColorGrid, ColorsApp, validColor } from "../Theme";

let selectedColor: validColor = ColorsApp.Blue;

export const TagDialog: React.FC = () => {
	const [tags, setTags] = useState<Tag[]>(knownTags);

	const getTag = (id: number): Tag => tags.find((tag) => tag.id === id) as Tag;
	const getNewTag = (id: number): Tag => ({ ...getTag(id) } as Tag);

	const addNewTag = (label: string): void => {
		if (label.trim().length === 0) return;
		const id = Math.floor(Math.random() * 100000000);
		const color = ColorGrid[Math.floor(Math.random() * ColorGrid.length)]
		const newTag: Tag = {
			id: id,
			label: label.trim(),
			color: color,
			ordering: tags.length,
		};
		setTags([...tags, newTag]);
	};

	const updateTagLabel = (id: number, label: string): void => {
		let newTag = getNewTag(id);
		newTag.label = label;

		let newTags = tags.map((tag) => (tag.id === id ? newTag : tag));
		setTags(newTags);
	};

	const updateTagColor = (id: number, color: validColor): void => {
		let newTag = getNewTag(id);
		newTag.color = color;

		let newTags = tags.map((tag) => (tag.id === id ? newTag : tag));
		setTags(newTags);
	};

	const moveTag = (id: number, move: -1 | 1): void => {
		let newTag1 = getNewTag(id);
		newTag1.ordering += move;

		let tag2 = tags.find((t) => t.ordering === newTag1.ordering) as Tag;
		let newTag2 = { ...tag2 } as Tag;
		newTag2.ordering -= move;

		let newTags = tags.map((tag) => {
			if (tag.id === newTag1.id) return newTag1;
			else if (tag.id === newTag2.id) return newTag2;
			return tag;
		});
		setTags(newTags);
	};

	const deleteTag = (id: number): void => {
		let newTags = tags.filter((tag) => tag.id != id);
		newTags = sortedTags(newTags);

		newTags = newTags.map((tag, index) => {
			let newTag = { ...tag } as Tag;
			newTag.ordering = index;
			return newTag;
		});

		setTags(newTags);
	};

	const sortedTags = (tagArray: Tag[] = tags): Tag[] => {
		return tagArray.sort((a, b) => a.ordering - b.ordering);
	};

	return (
		<Dialog open={true}>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				<NewTag addNewTag={addNewTag} tags={tags} />
				<Divider sx={{ margin: "1em 0" }} />
				{sortedTags().map((tag: Tag) => (
					<EditTag
						tag={tag}
						updateTagLabel={updateTagLabel}
						updateTagColor={updateTagColor}
						moveTag={moveTag}
						deleteTag={deleteTag}
					/>
				))}
			</DialogContent>
			<DialogActions>
				<Button>Salvar</Button>
			</DialogActions>
		</Dialog>
	);
};
