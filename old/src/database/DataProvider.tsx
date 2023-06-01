import {
	PropsWithChildren,
	createContext,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Task } from "./Task";
import { Tag, TagServer } from "./Tag";
import { auth } from "./Firebase";
import { UserServer } from "./User";

export interface CRUDOperation<T> {
	value: T[];
	create: (t: T) => void;
	read: (id: string) => T;
	update: (t: T) => void;
	destroy: (t: T) => void;
}

export interface Data {
	tags: CRUDOperation<Tag>;
	// tasks: CRUDOperation<Task>;
	// user: User | null;
}

export const DataContext = createContext<Data | undefined>(undefined);

export const DataProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);

	const loadTags = useCallback(async () => {
		console.log("loadTags");
		if (UserServer.isLoggedIn()) {
			const newTags = await TagServer.loadRemote();
			if (newTags) {
				console.log("setTags remote");
				setTags(newTags);
				return;
			}
		}
		const newTags = TagServer.loadLocal();
		console.log("setTags local");
		setTags(newTags);
		console.log(value);
	}, []);

	const createTag = useCallback(
		(tag: Tag) => {
			console.log("createTag");
			const newTags = [...tags, tag];
			console.log("setTags");
			setTags(newTags);
			TagServer.saveOneRemote(tag);
			TagServer.saveLocal(newTags);
		},
		[tags]
	);

	const readTag = useCallback(
		(id: string): Tag => {
			console.log("readTag");
			const tag: Tag = tags.find((tag: Tag): boolean => tag.id === id) as Tag;
			return tag;
		},
		[tags]
	);

	const updateTag = useCallback(
		(tagUpdated: Tag) => {
			console.log("updateTag");
			const newTags = tags.map(
				(tag: Tag): Tag => (tag.id === tagUpdated.id ? tagUpdated : tag)
			);
			console.log("setTags");
			setTags(newTags);
			TagServer.saveOneRemote(tagUpdated);
			TagServer.saveLocal(newTags);
		},
		[tags]
	);

	const destroyTag = useCallback(
		(tagToDestroy: Tag) => {
			console.log("destroyTag");
			const newTags = TagServer.normalizeOrdering(
				tags.filter((tag) => tag.id !== tagToDestroy.id)
			);
			console.log("setTags");
			setTags(newTags);
			TagServer.deleteOneRemote(tagToDestroy);
			TagServer.saveLocal(newTags);
		},
		[tags]
	);

	const value = {
		tags: {
			value: tags,
			create: createTag,
			read: readTag,
			update: updateTag,
			destroy: destroyTag,
		},
	};

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			loadTags();
		});
	}, [loadTags]);

	useEffect(() => {
		console.log("use effect was handled")
		value.tags = {
			value: TagServer.normalizeOrdering(tags),
			create: createTag,
			read: readTag,
			update: updateTag,
			destroy: destroyTag,
		};
	}, [tags, createTag, readTag, updateTag, destroyTag]);

	return (
		<DataContext.Provider value={value}>
			{children}
		</DataContext.Provider>
	);
};
