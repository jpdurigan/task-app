// import { Task, Task, exampleTasks, exampleTasks } from "./Model";
// import { PaletteGrid, ValidColor } from "./Theme";

import {
	DocumentData,
	FirestoreDataConverter,
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
	writeBatch,
} from "firebase/firestore";
import { UserServer } from "./User";
import { v4 as uuid } from "uuid";
import { db } from "./Firebase";

export class Task {
	id: string;
	date: number;
	text: string = "";
	tags: string[] = [];
	done: boolean = false;

	// firestore
	doc_id?: string;
	user_id?: string;

	constructor(
		id: string,
		date: number,
		text?: string,
		tags?: string[],
		done?: boolean
	) {
		this.id = id;
		this.date = date;
		if (text) this.text = text;
		if (done) this.done = done;
		if (tags) this.tags = tags;
	}

	toString = (): string => JSON.stringify(this);
}

export const exampleTasks: Task[] = [
	{
		id: "2",
		text: "Comprar leite e ovos",
		date: Date.now() - 50,
		done: true,
		tags: ["2"],
	},
	{
		id: "3",
		text: "Pesquisar preços de segundo monitor",
		date: Date.now() - 30,
		done: false,
		tags: ["2", "1"],
	},
	{
		id: "4",
		text: "Devolver livros da biblioteca",
		date: Date.now() - 10,
		done: false,
		tags: ["0"],
	},
	{
		id: "5",
		text: "Terminar componente até quinta",
		date: Date.now(),
		done: true,
		tags: ["1"],
	},
];

export class TaskServer {
	private tasks: Task[];
	private setTasks: React.Dispatch<React.SetStateAction<Task[]>>;

	public static instance: TaskServer;

	constructor(
		tasks: Task[],
		setTasks: React.Dispatch<React.SetStateAction<Task[]>>
	) {
		this.tasks = tasks;
		this.setTasks = setTasks;
	}

	public static init = (
		tasks: Task[],
		setTasks: React.Dispatch<React.SetStateAction<Task[]>>
	) => {
		console.log("--- INIT TASK SERVER");
		if (TaskServer.instance) return;
		TaskServer.instance = new TaskServer(tasks, setTasks);
		console.log("--- EXIT TASK SERVER");
	};

	//////////////////////////////
	//          TASKS           //
	//////////////////////////////

	public static getTask = (id: string): Task | undefined => {
		if (!TaskServer.instance) return undefined;
		return TaskServer.getAllTasks().find((task) => task.id === id) as Task;
	};

	public static getAllTasks = (): Task[] => {
		if (!TaskServer.instance) return [];
		return TaskServer.instance ? TaskServer.instance.tasks : [];
	};

	public static getCloneTask = (id: string): Task => {
		return { ...TaskServer.getTask(id) } as Task;
	};

	public static getNewTask = (): Task => {
		return new Task(uuid(), Date.now());
	};

	public static updateTasks = (tasks: Task[]): void => {
		console.log("--- ENTER UPDATE TASKS");
		TaskServer.instance.tasks = tasks;
		TaskServer.saveToStorage(tasks);
		console.log("--- EXIT UPDATE TASKS");
	};

	public static updateTask = (task: Task): void => {
		const taskExists =
			TaskServer.getAllTasks().findIndex((p_task) => p_task.id === task.id) !=
			-1;

		let newTasks: Task[] = [];
		if (taskExists) {
			newTasks = TaskServer.getAllTasks().map((p_task) =>
				task.id === p_task.id ? task : p_task
			);
		} else {
			newTasks = [...TaskServer.getAllTasks(), task]
		}
		TaskServer.instance.setTasks(newTasks);
	};

	public static updateTaskDone = (id: string, done: boolean): void => {
		let newTask = TaskServer.getCloneTask(id);
		newTask.done = done;

		let newTasks = TaskServer.getAllTasks().map((task) =>
			task.id === id ? newTask : task
		);
		TaskServer.instance.setTasks(newTasks);
	};

	public static deleteTask = (id: string): void => {
		let newTasks = TaskServer.getAllTasks().filter((task) => task.id !== id);
		TaskServer.instance.setTasks(newTasks);
	};

	public static sortTasks = (
		taskArray: Task[] = TaskServer.getAllTasks()
	): Task[] => {
		return taskArray.sort((a, b) => {
			if (a.done !== b.done) return a.done ? 1 : -1;
			else return a.date - b.date;
		});
	};

	public static getTasksByTag = (
		tagId: string,
		taskArray: Task[] = TaskServer.getAllTasks()
	): Task[] => {
		return TaskServer.sortTasks(
			taskArray.filter((task) => task.tags.includes(tagId))
		);
	};

	//////////////////////////////
	//       PERSISTENCE        //
	//////////////////////////////

	private static MAX_TRIES = 3;
	private static WAIT_FOR_NEXT_TRY = 100;
	private static tries = 0;

	public static loadFromServer = async () => {
		console.log("--- ENTER loadFromServer");
		if (!UserServer.isLoggedIn()) {
			console.warn("User not logged in!");
			return;
		}

		TaskServer.tries += 1;
		try {
			const collection = TaskServer.getCollection();
			const data = await getDocs<Task>(collection);
			let tags: Task[] = data.docs.map((tag) => tag.data());
			tags = TaskServer.sortTasks(tags);
			TaskServer.instance.setTasks(tags);
			console.log("Loaded tags from server!");
			TaskServer.tries = 0;
		} catch (err) {
			if (TaskServer.tries < TaskServer.MAX_TRIES) {
				console.log("--- TaskServer.tries < TaskServer.MAX_TRIES");
				setTimeout(TaskServer.loadFromServer, TaskServer.WAIT_FOR_NEXT_TRY);
			} else {
				console.error(err);
				TaskServer.loadFromStorage();
			}
		}
	};

	public static saveAllOnServer = async () => {
		console.log("--- ENTER saveAllOnServer");
		if (!UserServer.isLoggedIn()) return;

		const batch = writeBatch(db);
		TaskServer.getAllTasks().forEach((task) => {
			const document = TaskServer.getDocument(task);
			batch.set(document, task);
		});
		try {
			await batch.commit();
			console.log(`Tasks atualizadas`);
		} catch (err) {
			console.log(err);
		}
		console.log("--- EXIT saveAllOnServer");
	};

	public static saveTaskOnServer = async (tag: Task) => {
		console.log("--- ENTER saveTaskOnServer");
		if (!UserServer.isLoggedIn()) return;

		const document = TaskServer.getDocument(tag);
		try {
			await setDoc(document, tag);
			console.log(`${tag.toString()} adicionada`);
		} catch (err) {
			console.log(err);
		}
		console.log("--- EXIT saveTaskOnServer");
	};

	public static deleteTaskOnServer = async (tag: Task) => {
		if (!UserServer.isLoggedIn()) return;

		const document = TaskServer.getDocument(tag);
		try {
			await deleteDoc(document);
			console.log(`${tag.toString()} deletada`);
		} catch (err) {
			console.log(err);
		}
	};

	private static getDocument = (task: Task) =>
		doc(db, "app", UserServer.getId(), "tasks", task.id).withConverter(
			TaskFirestoreConverter
		);

	private static getCollection = () =>
		collection(db, "app", UserServer.getId(), "tasks").withConverter(
			TaskFirestoreConverter
		);

	static STORAGE_KEY = "JP_TASK_APP_TASKS";

	public static loadFromStorage = (): void => {
		const rawData = window.localStorage.getItem(TaskServer.STORAGE_KEY);
		if (rawData === null) {
			return;
		}

		const data = JSON.parse(rawData);
		if (data) TaskServer.instance.setTasks(data);
	};

	public static saveToStorage = (
		tasks: Task[] = TaskServer.getAllTasks()
	): void => {
		const data = JSON.stringify(tasks);
		window.localStorage.setItem(TaskServer.STORAGE_KEY, JSON.stringify(data));
		console.log(TaskServer.instance);
	};

	public static initialize = (): void => {
		TaskServer.instance.setTasks(exampleTasks);
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
