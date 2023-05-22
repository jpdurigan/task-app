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
import { PaletteGrid, ValidColor } from "./Theme";
import { v4 as uuid } from "uuid";
import { db } from "./Firebase";
import { UserServer } from "./User";

export class Tag {
	id: string;
	label: string;
	color: ValidColor;
	ordering: number;

	constructor(id: string, label: string, color: ValidColor, ordering: number) {
		this.id = id;
		this.label = label;
		this.color = color;
		this.ordering = ordering;
	}

	toString = (): string => JSON.stringify(this);
}

export const exampleTags: Tag[] = [
	{
		id: "0",
		label: "Universidade",
		color: "indigo",
		ordering: 0,
	},
	{
		id: "1",
		label: "Estágio",
		color: "orange",
		ordering: 1,
	},
	{
		id: "2",
		label: "Casa",
		color: "green",
		ordering: 2,
	},
];

export class TagServer {
	private tags: Tag[];
	private setTags: React.Dispatch<React.SetStateAction<Tag[]>>;

	public static instance: TagServer;

	constructor(
		tags: Tag[],
		setTags: React.Dispatch<React.SetStateAction<Tag[]>>
	) {
		this.tags = tags;
		this.setTags = setTags;
	}

	public static init = (
		tags: Tag[],
		setTags: React.Dispatch<React.SetStateAction<Tag[]>>
	) => {
		console.log("--- INIT TAG SERVER");
		if (TagServer.instance) return;
		TagServer.instance = new TagServer(tags, setTags);
		console.log("--- EXIT TAG SERVER");
	};

	//////////////////////////////
	//           TAGS           //
	//////////////////////////////

	// GET

	public static getTag = (id: string): Tag | undefined => {
		if (!TagServer.instance) return undefined;
		return TagServer.getAllTags().find((tag) => tag.id === id);
	};

	public static getAllTags = (): Tag[] => {
		if (!TagServer.instance) return [];
		return TagServer.instance ? TagServer.instance.tags : [];
	};

	public static getAllTagIds = (): string[] => {
		if (!TagServer.instance) return [];
		return TagServer.getAllTags().map((tag) => tag.id);
	};

	public static getCloneTag = (id: string): Tag => {
		return { ...TagServer.getTag(id) } as Tag;
	};

	// UPDATE

	public static updateTags = (tags: Tag[]): void => {
		console.log("--- ENTER UPDATE TAGS");
		TagServer.instance.tags = tags;
		TagServer.saveToStorage(tags);
		console.log("--- EXIT UPDATE TAGS");
	};

	public static addNewTag = (label: string): void => {
		if (label.trim().length === 0) return;

		const id = uuid();
		const color = PaletteGrid[Math.floor(Math.random() * PaletteGrid.length)];
		const newTag: Tag = {
			id: id,
			label: label.trim(),
			color: color,
			ordering: TagServer.getAllTags().length,
		};

		TagServer.instance.setTags([...TagServer.getAllTags(), newTag]);
		TagServer.saveTagOnServer(newTag);
	};

	public static updateTagLabel = (id: string, label: string): void => {
		let newTag = TagServer.getCloneTag(id);
		newTag.label = label;

		let newTags = TagServer.getAllTags().map((tag) =>
			tag.id === id ? newTag : tag
		);

		TagServer.instance.setTags(newTags);
		TagServer.saveTagOnServer(newTag);
	};

	public static updateTagColor = (id: string, color: ValidColor): void => {
		let newTag = TagServer.getCloneTag(id);
		newTag.color = color;

		let newTags = TagServer.getAllTags().map((tag) =>
			tag.id === id ? newTag : tag
		);

		TagServer.instance.setTags(newTags);
		TagServer.saveTagOnServer(newTag);
	};

	public static moveTag = (id: string, move: -1 | 1): void => {
		console.log("--- ENTER MOVE TAG");
		let newTag1 = TagServer.getCloneTag(id);
		newTag1.ordering += move;

		let tag2 = TagServer.getAllTags().find(
			(t) => t.ordering === newTag1.ordering
		) as Tag;
		let newTag2 = { ...tag2 } as Tag;
		newTag2.ordering -= move;

		let newTags = TagServer.getAllTags().map((tag) => {
			if (tag.id === newTag1.id) return newTag1;
			else if (tag.id === newTag2.id) return newTag2;
			return tag;
		});

		newTags = TagServer.normalizeOrdering(newTags);
		TagServer.instance.setTags(newTags);
		TagServer.saveAllOnServer();
		console.log("--- EXIT MOVE TAG");
	};

	// DELETE

	public static deleteTag = (id: string): void => {
		const tagDeleted = TagServer.getTag(id) as Tag;

		let newTags = TagServer.getAllTags().filter((tag) => tag.id !== id);
		newTags = TagServer.normalizeOrdering(newTags);

		// // handle tasks
		// let newTasks = this.tasks.map((task) => {
		// 	const newTask = this.getCloneTask(task.id);
		// 	newTask.tags = newTask.tags.filter((tag: string) => tag !== id);
		// 	return newTask;
		// });
		// this.setTasks(newTasks);

		TagServer.instance.setTags(newTags);
		TagServer.deleteTagOnServer(tagDeleted);
	};

	public static sortTags = (
		tagArray: Tag[] = TagServer.getAllTags()
	): Tag[] => {
		return tagArray.sort((a, b) => a.ordering - b.ordering);
	};

	public static normalizeOrdering = (
		tags: Tag[] = TagServer.getAllTags()
	): Tag[] => {
		tags = TagServer.sortTags(tags);
		tags = tags.map((tag, index) => {
			let newTag = { ...tag } as Tag;
			newTag.ordering = index;
			return newTag;
		});
		return tags;
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

		TagServer.tries += 1;
		try {
			const collection = TagServer.getCollection();
			const data = await getDocs<Tag>(collection);
			let tags: Tag[] = data.docs.map((tag) => tag.data());
			tags = TagServer.normalizeOrdering(tags);
			TagServer.instance.setTags(tags);
			console.log("Loaded tags from server!");
			TagServer.tries = 0;
		} catch (err) {
			if (TagServer.tries < TagServer.MAX_TRIES) {
				console.log("--- TagServer.tries < TagServer.MAX_TRIES");
				setTimeout(TagServer.loadFromServer, TagServer.WAIT_FOR_NEXT_TRY);
			} else {
				console.error(err);
				TagServer.loadFromStorage();
			}
		}
	};

	public static saveAllOnServer = async () => {
		console.log("--- ENTER saveAllOnServer");
		if (!UserServer.isLoggedIn()) return;

		const batch = writeBatch(db);
		TagServer.getAllTags().forEach((tag) => {
			const document = TagServer.getDocument(tag);
			batch.set(document, tag);
		});
		try {
			await batch.commit();
			console.log(`Tags atualizadas`);
		} catch (err) {
			console.log(err);
		}
		console.log("--- EXIT saveAllOnServer");
	};

	public static saveTagOnServer = async (tag: Tag) => {
		console.log("--- ENTER saveTagOnServer");
		if (!UserServer.isLoggedIn()) return;

		const document = TagServer.getDocument(tag);
		try {
			await setDoc(document, tag);
			console.log(`${tag.toString()} adicionada`);
		} catch (err) {
			console.log(err);
		}
		console.log("--- EXIT saveTagOnServer");
	};

	public static deleteTagOnServer = async (tag: Tag) => {
		if (!UserServer.isLoggedIn()) return;

		const document = TagServer.getDocument(tag);
		try {
			await deleteDoc(document);
			console.log(`${tag.toString()} deletada`);
		} catch (err) {
			console.log(err);
		}
	};

	private static getDocument = (tag: Tag) =>
		doc(db, "app", UserServer.getId(), "tags", tag.id).withConverter(
			TagFirestoreConverter
		);

	private static getCollection = () =>
		collection(db, "app", UserServer.getId(), "tags").withConverter(
			TagFirestoreConverter
		);

	static STORAGE_KEY = "JP_TASK_APP_TAGS";

	public static loadFromStorage = (): void => {
		const rawData = window.localStorage.getItem(TagServer.STORAGE_KEY);
		if (rawData === null) {
			return;
		}

		const data = JSON.parse(rawData);
		if (data) TagServer.instance.setTags(data);
	};

	public static saveToStorage = (
		tags: Tag[] = TagServer.getAllTags()
	): void => {
		const data = JSON.stringify(tags);
		window.localStorage.setItem(TagServer.STORAGE_KEY, JSON.stringify(data));
		console.log(TagServer.instance);
	};

	public static populateWithExamples = (): void => {
		TagServer.instance.setTags(exampleTags);
		TagServer.saveAllOnServer();
	};
}

//////////////////////////////
//        FIRESTORE         //
//////////////////////////////

export const TagFirestoreConverter: FirestoreDataConverter<Tag> = {
	toFirestore: (tag: Tag): DocumentData => {
		return {
			id: tag.id,
			label: tag.label,
			color: tag.color,
			ordering: tag.ordering,
		};
	},
	fromFirestore: (snapshot, options): Tag => {
		const data = snapshot.data(options);
		const tag: Tag = {
			id: data.id,
			label: data.label,
			color: data.color,
			ordering: data.ordering,
		};
		return tag;
	},
};
