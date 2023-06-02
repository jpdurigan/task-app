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
import { TagColors, getRandomTagColor } from "../Theme";
import { v4 as uuid } from "uuid";
import { db, getFirebaseUserId, hasFirebaseUser } from "./Firebase";

export class Tag {
	id: string;
	label: string;
	color: TagColors;
	ordering: number;

	constructor(id: string, label: string, color: TagColors, ordering: number) {
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
		label: "Estudos",
		color: TagColors.BLUE,
		ordering: 0,
	},
	{
		id: "1",
		label: "Trabalho",
		color: TagColors.YELLOW,
		ordering: 1,
	},
	{
		id: "2",
		label: "Casa",
		color: TagColors.PINK,
		ordering: 2,
	},
];

export class TagServer {
	public static getIds = (tags: Tag[]): string[] => {
		return tags.map((tag) => tag.id);
	};

	public static getClone = (tag: Tag): Tag => {
		return { ...tag } as Tag;
	};

	public static getNewTag = (): Tag => {
		const id = uuid();
		const color = getRandomTagColor();
		const newTag: Tag = {
			id: id,
			label: "",
			color: color,
			ordering: Number.MAX_VALUE,
		};
		return newTag;
	};

	public static sortTags = (tags: Tag[]): Tag[] => {
		return tags.sort((a, b) => a.ordering - b.ordering);
	};

	// I'm saving ordering as multiple of 2 (0, 2, 4, 6, 8...)
	// so that moving them up or down is simpler (just add ou take 1)
	public static normalizeOrdering = (tags: Tag[]): Tag[] => {
		tags = TagServer.sortTags(tags);
		tags = tags.map((tag, index) => {
			let newTag = { ...tag } as Tag;
			newTag.ordering = index * 2;
			return newTag;
		});
		return tags;
	};

	//////////////////////////////
	//       PERSISTENCE        //
	//////////////////////////////

	public static loadRemote = async (): Promise<Tag[] | undefined> => {
		if (!hasFirebaseUser()) {
			console.warn("User not logged in!");
			return;
		}

		try {
			const collection = TagServer.getCollection();
			const data = await getDocs<Tag>(collection);
			let tags: Tag[] = data.docs.map((tag) => tag.data());
			tags = TagServer.normalizeOrdering(tags);
			console.log(`Documentos carregados: ${tags}`);
			return tags;
		} catch (err) {
			console.warn("Error loading from server");
			console.log(err);
			return;
		}
	};

	public static saveAllRemote = async (tags: Tag[]) => {
		if (!hasFirebaseUser()) return;

		const batch = writeBatch(db);
		tags.forEach((tag) => {
			const document = TagServer.getDocument(tag);
			batch.set(document, tag);
			console.log(`Documento adicionado ao batch: ${tag.toString()}`);
		});
		try {
			await batch.commit();
			console.log("Documentos atualizados");
		} catch (err) {
			console.warn("Error saving remote");
			console.log(err);
		}
	};

	public static saveOneRemote = async (tag: Tag) => {
		if (!hasFirebaseUser()) return;

		const document = TagServer.getDocument(tag);
		try {
			await setDoc(document, tag);
			console.log(`Documento atualizado: ${tag.toString()}`);
		} catch (err) {
			console.warn("Error saving one on remote");
			console.log(err);
		}
	};

	public static deleteAllRemote = async (tags: Tag[]) => {
		if (!hasFirebaseUser()) return;

		const batch = writeBatch(db);
		tags.forEach((tag) => {
			const document = TagServer.getDocument(tag);
			batch.delete(document);
			console.log(`Documento adicionado para deleção: ${tag.toString()}`);
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

	public static deleteOneRemote = async (tag: Tag) => {
		if (!hasFirebaseUser()) return;

		const document = TagServer.getDocument(tag);
		try {
			await deleteDoc(document);
			console.log(`Documento deletado: ${tag.toString()}`);
		} catch (err) {
			console.warn("Error deleting one on remote");
			console.log(err);
			return;
		}
	};

	private static getDocument = (tag: Tag) =>
		doc(db, "app", getFirebaseUserId(), "tags", tag.id).withConverter(
			TagFirestoreConverter
		);

	private static getCollection = () =>
		collection(db, "app", getFirebaseUserId(), "tags").withConverter(
			TagFirestoreConverter
		);

	static STORAGE_KEY = "JP_TASK_APP_TAGS";

	public static loadLocal = (): Tag[] => {
		const rawData = window.localStorage.getItem(TagServer.STORAGE_KEY);
		if (rawData === null) {
			return [];
		}

		const data = JSON.parse(rawData) as Tag[];
		return Array.isArray(data) ? data : [];
	};

	public static saveLocal = (tags: Tag[]): void => {
		const data = JSON.stringify(tags);
		window.localStorage.setItem(TagServer.STORAGE_KEY, JSON.stringify(data));
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
