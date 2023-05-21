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
		id: uuid(),
		label: "Universidade",
		color: "indigo",
		ordering: 0,
	},
	{
		id: uuid(),
		label: "Estágio",
		color: "orange",
		ordering: 1,
	},
	{
		id: uuid(),
		label: "Casa",
		color: "green",
		ordering: 2,
	},
];

export class TagServer {
	protected tags: Tag[];
	protected setTags: React.Dispatch<React.SetStateAction<Tag[]>>;

	private static instance: TagServer;

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
		if (TagServer.instance) return;
		TagServer.instance = new TagServer(tags, setTags);
	};

	//////////////////////////////
	//           TAGS           //
	//////////////////////////////

	// GET

	public static getTag = (id: string): Tag => {
		return TagServer.instance.tags.find((tag) => tag.id === id) as Tag;
	};

	public static getAllTags = (): Tag[] => {
		return TagServer.instance.tags;
	};

	public static getAllTagIds = (): string[] => {
		return TagServer.instance.tags.map((tag) => tag.id);
	};

	// public static getTagsForDisplay = (): (string | undefined)[] => [
	// 	undefined,
	// 	...TagServer.getAllTags(),
	// ];

	public static getCloneTag = (id: string): Tag => {
		return { ...TagServer.getTag(id) } as Tag;
	};

	// UPDATE

	public static addNewTag = (label: string): void => {
		if (label.trim().length === 0) return;

		const id = uuid();
		const color = PaletteGrid[Math.floor(Math.random() * PaletteGrid.length)];
		const newTag: Tag = {
			id: id,
			label: label.trim(),
			color: color,
			ordering: TagServer.instance.tags.length,
		};

		TagServer.instance.setTags([...TagServer.instance.tags, newTag]);
		TagServer.saveTagOnServer(newTag);
	};

	public static updateTagLabel = (id: string, label: string): void => {
		let newTag = TagServer.getCloneTag(id);
		newTag.label = label;

		let newTags = TagServer.instance.tags.map((tag) =>
			tag.id === id ? newTag : tag
		);

		TagServer.instance.setTags(newTags);
		TagServer.saveTagOnServer(newTag);
	};

	public static updateTagColor = (id: string, color: ValidColor): void => {
		let newTag = TagServer.getCloneTag(id);
		newTag.color = color;

		let newTags = TagServer.instance.tags.map((tag) =>
			tag.id === id ? newTag : tag
		);

		TagServer.instance.setTags(newTags);
		TagServer.saveTagOnServer(newTag);
	};

	public static moveTag = (id: string, move: -1 | 1): void => {
		let newTag1 = TagServer.getCloneTag(id);
		newTag1.ordering += move;

		let tag2 = TagServer.instance.tags.find(
			(t) => t.ordering === newTag1.ordering
		) as Tag;
		let newTag2 = { ...tag2 } as Tag;
		newTag2.ordering -= move;

		let newTags = TagServer.instance.tags.map((tag) => {
			if (tag.id === newTag1.id) return newTag1;
			else if (tag.id === newTag2.id) return newTag2;
			return tag;
		});

		TagServer.instance.setTags(newTags);
		TagServer.saveAllOnServer();
	};

	public static deleteTag = (id: string): void => {
		const tagDeleted = TagServer.getTag(id);

		let newTags = TagServer.instance.tags.filter((tag) => tag.id !== id);
		newTags = TagServer.sortTags(newTags);

		newTags = newTags.map((tag, index) => {
			let newTag = { ...tag } as Tag;
			newTag.ordering = index;
			return newTag;
		});

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
		tagArray: Tag[] = TagServer.instance.tags
	): Tag[] => {
		return tagArray.sort((a, b) => a.ordering - b.ordering);
	};

	//////////////////////////////
	//       PERSISTENCE        //
	//////////////////////////////

	public static loadFromServer = async () => {
		if (!UserServer.isLoggedIn()) {
			console.warn("User not logged in!");
			return;
		}

		try {
			const collection = TagServer.getCollection();
			const data = await getDocs<Tag>(collection);
			const tags: Tag[] = data.docs.map((tag) => tag.data());
			TagServer.instance.setTags(tags);
		} catch (err) {
			console.error(err);
		}
	};

	public static saveAllOnServer = async () => {
		if (!UserServer.isLoggedIn()) return;

		const batch = writeBatch(db);
		TagServer.instance.tags.forEach((tag) => {
			const document = TagServer.getDocument(tag);
			batch.set(document, tag);
		});
		try {
			await batch.commit();
			console.log(`Tags atualizadas`);
		} catch (err) {
			console.log(err);
		}
	};

	public static saveTagOnServer = async (tag: Tag) => {
		if (!UserServer.isLoggedIn()) return;

		const document = TagServer.getDocument(tag);
		try {
			await setDoc(document, tag);
			console.log(`${tag.toString()} adicionada`);
		} catch (err) {
			console.log(err);
		}
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

	public static saveToStorage = (tags: Tag[] = TagServer.instance.tags): void => {
		const data = JSON.stringify(tags);
		window.localStorage.setItem(TagServer.STORAGE_KEY, JSON.stringify(data));
	};

	public static initialize = (): void => {
		TagServer.instance.setTags(exampleTags);
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
