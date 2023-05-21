// import { Task, Tag, exampleTags, exampleTasks } from "./Model";
// import { PaletteGrid, ValidColor } from "./Theme";

import { DocumentData, FirestoreDataConverter } from "firebase/firestore";

export class Task {
	id: string;
	text: string;
	date: number;
	done: boolean;
	tags: string[];

	// firestore
	doc_id?: string;
	user_id?: string;

	constructor(
		id: string,
		text: string,
		date: number,
		done: boolean,
		tags: string[]
	) {
		this.id = id;
		this.text = text;
		this.date = date;
		this.done = done;
		this.tags = tags;
	}

	toString = (): string => JSON.stringify(this);
}

export const exampleTasks: Task[] = [
	{
		id: "2",
		text: "Comprar leite e ovos",
		date: Date.now() + 1,
		done: true,
		tags: ["2"],
	},
	{
		id: "3",
		text: "Pesquisar preços de segundo monitor",
		date: Date.now() + 2,
		done: false,
		tags: ["2", "1"],
	},
	{
		id: "4",
		text: "Devolver livros da biblioteca",
		date: Date.now() + 3,
		done: false,
		tags: ["0"],
	},
	{
		id: "5",
		text: "Terminar componente até quinta",
		date: Date.now() + 4,
		done: true,
		tags: ["1"],
	},
];

export class TaskDatabase {
	tasks: Task[];
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;

	constructor(
		tasks: Task[],
		setTasks: React.Dispatch<React.SetStateAction<Task[]>>
	) {
		this.tasks = tasks;
		this.setTasks = setTasks;
	}

	//////////////////////////////
	//          TASKS           //
	//////////////////////////////

	getTask = (id: string): Task => {
		return this.tasks.find((tag) => tag.id === id) as Task;
	};

	getCloneTask = (id: string): Task => {
		return { ...this.getTask(id) } as Task;
	};

	addNewTask = (text: string, tags: string[]): void => {
		if (text.trim().length === 0) return;
		const id = `PSEUDO-ID:${Math.floor(Math.random() * 100000000)}`;
		const newTask: Task = {
			id: id,
			text: text.trim(),
			date: Date.now(),
			done: false,
			tags: tags,
		};
		this.setTasks([...this.tasks, newTask]);
	};

	updateTask = (id: string, text: string, tags: string[]): void => {
		let newTask = this.getCloneTask(id);
		newTask.text = text;
		newTask.tags = tags;

		let newTasks = this.tasks.map((task) => (task.id === id ? newTask : task));
		this.setTasks(newTasks);
	};

	updateTaskDone = (id: string, done: boolean): void => {
		let newTask = this.getCloneTask(id);
		newTask.done = done;

		let newTasks = this.tasks.map((task) => (task.id === id ? newTask : task));
		this.setTasks(newTasks);
	};

	deleteTask = (id: string): void => {
		let newTasks = this.tasks.filter((task) => task.id !== id);
		this.setTasks(newTasks);
	};

	sortTasks = (taskArray: Task[] = this.tasks): Task[] => {
		return taskArray.sort((a, b) => {
			if (a.done !== b.done) return a.done ? 1 : -1;
			else return a.date - b.date;
		});
	};

	getTasksByTag = (tagId: string, taskArray: Task[] = this.tasks): Task[] => {
		return this.sortTasks(
			taskArray.filter((task) => task.tags.includes(tagId))
		);
	};
}

//////////////////////////////
//        FIRESTORE         //
//////////////////////////////

export const TaskFirestoreConverter: FirestoreDataConverter<Task> = {
	toFirestore: (task: Task): DocumentData => {
		return {
			id: task.id,
			text: task.text,
			date: task.date,
			done: task.done,
			tags: task.tags,
		};
	},
	fromFirestore: (snapshot, options): Task => {
		const data = snapshot.data(options);
		const tag: Task = {
			id: data.id,
			text: data.text,
			date: data.date,
			done: data.done,
			tags: data.tags,
		};
		return tag;
	},
};
