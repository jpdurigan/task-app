import { Task, Tag } from "./Model";
import { ColorGrid, validColor } from "./Theme";

export class Database {
	tasks: Task[];
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
	tags: Tag[];
	setTags: React.Dispatch<React.SetStateAction<Tag[]>>;

	constructor(
		tasks: Task[],
		setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
		tags: Tag[],
		setTags: React.Dispatch<React.SetStateAction<Tag[]>>
	) {
		this.tasks = tasks;
		this.setTasks = setTasks;
		this.tags = tags;
		this.setTags = setTags;
	}

	getTag = (id: number): Tag => {
		return this.tags.find((tag) => tag.id === id) as Tag;
	}

	getNewTag = (id: number): Tag => {
		return { ...this.getTag(id) } as Tag;
	}

	addNewTag = (label: string): void => {
		if (label.trim().length === 0) return;
		const id = Math.floor(Math.random() * 100000000);
		const color = ColorGrid[Math.floor(Math.random() * ColorGrid.length)];
		const newTag: Tag = {
			id: id,
			label: label.trim(),
			color: color,
			ordering: this.tags.length,
		};
		this.setTags([...this.tags, newTag]);
	}

	updateTagLabel = (id: number, label: string): void => {
		let newTag = this.getNewTag(id);
		newTag.label = label;

		let newTags = this.tags.map((tag) => (tag.id === id ? newTag : tag));
		this.setTags(newTags);
	}

	updateTagColor = (id: number, color: validColor): void => {
		let newTag = this.getNewTag(id);
		newTag.color = color;

		let newTags = this.tags.map((tag) => (tag.id === id ? newTag : tag));
		this.setTags(newTags);
	}

	moveTag = (id: number, move: -1 | 1): void => {
		let newTag1 = this.getNewTag(id);
		newTag1.ordering += move;

		let tag2 = this.tags.find((t) => t.ordering === newTag1.ordering) as Tag;
		let newTag2 = { ...tag2 } as Tag;
		newTag2.ordering -= move;

		let newTags = this.tags.map((tag) => {
			if (tag.id === newTag1.id) return newTag1;
			else if (tag.id === newTag2.id) return newTag2;
			return tag;
		});
		this.setTags(newTags);
	}

	deleteTag = (id: number): void => {
		let newTags = this.tags.filter((tag) => tag.id != id);
		newTags = this.sortedTags(newTags);

		newTags = newTags.map((tag, index) => {
			let newTag = { ...tag } as Tag;
			newTag.ordering = index;
			return newTag;
		});

		this.setTags(newTags);
	}

	sortedTags = (tagArray: Tag[] = this.tags): Tag[] => {
		return tagArray.sort((a, b) => a.ordering - b.ordering);
	}
}
