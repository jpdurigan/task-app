import { Task, Tag } from "./Model";
import { ColorGrid, validColor } from "./Theme";

export class Database {
	tasks: Task[];
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
	tags: Tag[];
	setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
	editingTask: number | undefined;
	setEditingTask: React.Dispatch<React.SetStateAction<number | undefined>>;
	showTagsDialog: boolean;
	setShowTagsDialog: React.Dispatch<React.SetStateAction<boolean>>;

	constructor(
		tasks: Task[],
		setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
		tags: Tag[],
		setTags: React.Dispatch<React.SetStateAction<Tag[]>>,
		editingTask: number | undefined,
		setEditingTask: React.Dispatch<React.SetStateAction<number | undefined>>,
		showTagsDialog: boolean,
		setShowTagsDialog: React.Dispatch<React.SetStateAction<boolean>>
	) {
		this.tasks = tasks;
		this.setTasks = setTasks;
		this.tags = tags;
		this.setTags = setTags;
		this.editingTask = editingTask;
		this.setEditingTask = setEditingTask;
		this.showTagsDialog = showTagsDialog;
		this.setShowTagsDialog = setShowTagsDialog;
	}

	showTaskDialog = () => this.editingTask != undefined;

	//////////////////////////////
	//          TASKS           //
	//////////////////////////////

	getTask = (id: number): Task => {
		return this.tasks.find((tag) => tag.id === id) as Task;
	};

	getCloneTask = (id: number): Task => {
		return { ...this.getTask(id) } as Task;
	};

	addNewTask = (text: string, tags: number[]): void => {
		if (text.trim().length === 0) return;
		const id = Math.floor(Math.random() * 100000000);
		const newTask: Task = {
			id: id,
			text: text.trim(),
			date: Date.now(),
			done: false,
			tags: tags,
		};
		this.setTasks([...this.tasks, newTask]);
	};

	updateTask = (id: number, text: string, tags: number[]): void => {
		let newTask = this.getCloneTask(id);
		newTask.text = text;
		newTask.tags = tags;

		let newTasks = this.tasks.map((task) => (task.id === id ? newTask : task));
		this.setTasks(newTasks);
	};

	updateTaskDone = (id: number, done: boolean): void => {
		let newTask = this.getCloneTask(id);
		newTask.done = done;

		let newTasks = this.tasks.map((task) => (task.id === id ? newTask : task));
		this.setTasks(newTasks);
	};

	deleteTask = (id: number): void => {
		let newTasks = this.tasks.filter((task) => task.id != id);
		this.setTasks(newTasks);
	};

	sortTasks = (taskArray: Task[] = this.tasks): Task[] => {
		return taskArray.sort((a, b) => {
			if (a.done != b.done) return a.done ? 1 : -1;
			else return a.date - b.date;
		});
	};

	//////////////////////////////
	//           TAGS           //
	//////////////////////////////

	getTag = (id: number): Tag => {
		return this.tags.find((tag) => tag.id === id) as Tag;
	};

	getCloneTag = (id: number): Tag => {
		return { ...this.getTag(id) } as Tag;
	};

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
	};

	updateTagLabel = (id: number, label: string): void => {
		let newTag = this.getCloneTag(id);
		newTag.label = label;

		let newTags = this.tags.map((tag) => (tag.id === id ? newTag : tag));
		this.setTags(newTags);
	};

	updateTagColor = (id: number, color: validColor): void => {
		let newTag = this.getCloneTag(id);
		newTag.color = color;

		let newTags = this.tags.map((tag) => (tag.id === id ? newTag : tag));
		this.setTags(newTags);
	};

	moveTag = (id: number, move: -1 | 1): void => {
		let newTag1 = this.getCloneTag(id);
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
	};

	deleteTag = (id: number): void => {
		let newTags = this.tags.filter((tag) => tag.id != id);
		newTags = this.sortTags(newTags);

		newTags = newTags.map((tag, index) => {
			let newTag = { ...tag } as Tag;
			newTag.ordering = index;
			return newTag;
		});

		let newTasks = this.tasks.map((task) => {
			const newTask = this.getCloneTask(task.id);
			newTask.tags = newTask.tags.filter((tag: number) => tag != id)
			return newTask;
		});
		
		this.setTasks(newTasks);
		this.setTags(newTags);
	};

	sortTags = (tagArray: Tag[] = this.tags): Tag[] => {
		return tagArray.sort((a, b) => a.ordering - b.ordering);
	};
}
