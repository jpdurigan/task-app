import { User } from "firebase/auth";
import { Tag, TagFirestoreConverter, TagServer, exampleTags } from "./Tag";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./Firebase";
import { Task, TaskFirestoreConverter } from "./Task";

export class UserServer {
	protected currentUser: User | null = null;

	public static readonly instance: UserServer = new UserServer();

	public static setCurrentUser = async (user: User | null) => {
		UserServer.instance.currentUser = user;

		if (!user) return;

		await TagServer.loadFromServer();
		// const tags = await UserServer.requestTags();
		// console.log(tags);

		// exampleTags.forEach(async (tag) => {
		//     const document = doc(db, "app", UserServer.instance.currentUser!.uid, "tags", tag.id);
		// 	try {
		// 		await setDoc(document, tag);
		//         console.log(`${tag} adicionada`)
		// 	} catch (err) {
		// 		console.log(err);
		// 	}
		// });
	};

	public static getId = (): string => {
		if (UserServer.instance.currentUser)
			return UserServer.instance.currentUser.uid;
		return "";
	};

	public static isLoggedIn = (): boolean =>
		UserServer.instance.currentUser != null;

	public static requestTasks = async (): Promise<Task[]> => {
		if (!UserServer.instance.currentUser) {
			console.warn("User not logged in!");
			return [];
		}

		try {
			const UserTaskCollection = collection(
				db,
				"app",
				UserServer.instance.currentUser.uid,
				"tasks"
			).withConverter(TaskFirestoreConverter);
			const data = await getDocs<Task>(UserTaskCollection);
			const tasks: Task[] = data.docs.map((tag) => tag.data());

			return tasks;
		} catch (err) {
			console.error(err);
			return [];
		}
	};
}
