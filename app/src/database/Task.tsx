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
import { v4 as uuid } from "uuid";
import { db, getFirebaseUserId, hasFirebaseUser } from "./Firebase";
import { AppFilterDone } from "../AppGlobals";
import { Tag } from "./Tag";

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
		id: uuid(),
		text: "Comprar leite e ovos",
		date: Date.now() - 50,
		done: true,
		tags: ["2"],
	},
	{
		id: uuid(),
		text: "Pesquisar preços de segundo monitor",
		date: Date.now() - 30,
		done: false,
		tags: ["2", "1"],
	},
	{
		id: uuid(),
		text: "Devolver livros da biblioteca",
		date: Date.now() - 10,
		done: false,
		tags: ["0"],
	},
	{
		id: uuid(),
		text: "Terminar componente até quinta",
		date: Date.now(),
		done: true,
		tags: ["1"],
	},
];

export class TaskServer {
	public static getClone = (task: Task): Task => {
		return { ...task } as Task;
	};

	public static getNewTask = (): Task => {
		return new Task(uuid(), Date.now());
	};

	// this actually returns the tag ordering
	// used for sorting tasks
	public static getHighestTag = (task: Task, allTags: Tag[]): number => {
		const getTag = (tagId: string) => allTags.find((tag) => tag.id === tagId);
		const highestTag = task.tags.reduce(
			(carry, current) =>
				Math.min(getTag(current)?.ordering || Number.MAX_VALUE, carry),
			Number.MAX_VALUE
		);
		return highestTag;
	};

	public static sortTasks = (tasks: Task[], allTags: Tag[]): Task[] => {
		return tasks.sort((a, b) => {
			if (a.done !== b.done) {
				return a.done ? 1 : -1;
			} else if (
				TaskServer.getHighestTag(a, allTags) !=
				TaskServer.getHighestTag(b, allTags)
			) {
				return (
					TaskServer.getHighestTag(a, allTags) -
					TaskServer.getHighestTag(b, allTags)
				);
			} else {
				return a.date - b.date;
			}
		});
	};

	public static filterByTags = (
		tasks: Task[],
		tags: string[],
		done: AppFilterDone,
		allTags: Tag[]
	): Task[] => {
		const possibleDones = [
			done === AppFilterDone.ALL || done == AppFilterDone.DONE ? true : null,
			done === AppFilterDone.ALL || done == AppFilterDone.NOT_DONE
				? false
				: null,
		];

		const doneCondition = (task: Task): boolean =>
			possibleDones.includes(task.done);
		const tagCondition = (task: Task): boolean =>
			tags.length > 0
				? task.tags.some((tagId) => tags.includes(tagId))
				: task.tags.length == tags.length;

		const filteredTasks = tasks.filter((task: Task) => {
			return doneCondition(task) && tagCondition(task);
		});

		return TaskServer.sortTasks(filteredTasks, allTags);
	};

	public static normalizeTags = (tasks: Task[], tags: Tag[]): Task[] => {
		const validTags: string[] = tags.map((tag) => tag.id);
		const newTasks = tasks.map((task: Task): Task => {
			const newTask = TaskServer.getClone(task);
			newTask.tags = task.tags.filter((tagId) => validTags.includes(tagId));
			return newTask;
		});
		return newTasks;
	};

	//////////////////////////////
	//       PERSISTENCE        //
	//////////////////////////////

	public static loadRemote = async (): Promise<Task[] | undefined> => {
		if (!hasFirebaseUser()) {
			console.warn("User not logged in!");
			return;
		}

		try {
			const collection = TaskServer.getCollection();
			const data = await getDocs<Task>(collection);
			let tasks: Task[] = data.docs.map((task) => task.data());
			console.log(`Documentos carregados: ${tasks}`);
			return tasks;
		} catch (err) {
			console.warn("Error loading from server");
			console.log(err);
			return;
		}
	};

	public static saveAllRemote = async (tasks: Task[]) => {
		if (!hasFirebaseUser()) return;

		const batch = writeBatch(db);
		tasks.forEach((task) => {
			const document = TaskServer.getDocument(task);
			batch.set(document, task);
			console.log(`Documento adicionado ao batch: ${task.toString()}`);
		});

		try {
			await batch.commit();
			console.log("Documentos atualizados");
		} catch (err) {
			console.warn("Error saving remote");
			console.log(err);
		}
	};

	public static saveOneRemote = async (task: Task) => {
		if (!hasFirebaseUser()) return;

		const document = TaskServer.getDocument(task);
		try {
			await setDoc(document, task);
			console.log(`Documento atualizado: ${task.toString()}`);
		} catch (err) {
			console.warn("Error saving one on remote");
			console.log(err);
		}
	};

	public static deleteAllRemote = async (tasks: Task[]) => {
		if (!hasFirebaseUser()) return;

		const batch = writeBatch(db);
		tasks.forEach((task) => {
			const document = TaskServer.getDocument(task);
			batch.delete(document);
			console.log(`Documento adicionado para deleção: ${task.toString()}`);
		});
		try {
			await batch.commit();
			console.log("Documentos deletados");
		} catch (err) {
			console.warn("Error saving remote");
			console.log(err);
			return;
		}
	};

	public static deleteOneRemote = async (task: Task) => {
		if (!hasFirebaseUser()) return;

		const document = TaskServer.getDocument(task);
		try {
			await deleteDoc(document);
			console.log(`Documento deletado: ${task.toString()}`);
		} catch (err) {
			console.warn("Error deleting one on remote");
			console.log(err);
			return;
		}
	};

	private static getDocument = (task: Task) =>
		doc(db, "app", getFirebaseUserId(), "tasks", task.id).withConverter(
			TaskFirestoreConverter
		);

	private static getCollection = () =>
		collection(db, "app", getFirebaseUserId(), "tasks").withConverter(
			TaskFirestoreConverter
		);

	static STORAGE_KEY = "JP_TASK_APP_TASKS";

	public static loadLocal = (): Task[] => {
		const rawData = window.localStorage.getItem(TaskServer.STORAGE_KEY);
		if (rawData === null) {
			return [];
		}

		const data = JSON.parse(rawData) as Task[];
		return Array.isArray(data) ? data : [];
	};

	public static saveLocal = (tags: Task[]): void => {
		const data = JSON.stringify(tags);
		window.localStorage.setItem(TaskServer.STORAGE_KEY, data);
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
