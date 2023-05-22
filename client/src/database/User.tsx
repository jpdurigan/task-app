import { User } from "firebase/auth";
import { TagServer } from "./Tag";
import { TaskServer } from "./Task";

export class UserServer {
	protected currentUser: User | null = null;

	public static readonly instance: UserServer = new UserServer();

	public static setCurrentUser = async (user: User | null) => {
		UserServer.instance.currentUser = user;

		if (!user) return;
		await TagServer.loadFromServer();
		await TaskServer.loadFromServer();
	};

	public static getId = (): string => {
		if (UserServer.instance.currentUser)
			return UserServer.instance.currentUser.uid;
		return "";
	};

	public static isLoggedIn = (): boolean =>
		UserServer.instance.currentUser != null;
}
