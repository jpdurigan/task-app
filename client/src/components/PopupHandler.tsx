import { Add, ManageAccounts, Settings } from "@mui/icons-material";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { Database } from "../database/Database";
import { useEffect, useState } from "react";
import { Task, TaskServer } from "../database/Task";
import { TagDialog } from "./tag/TagDialog";
import { TaskDialog } from "./task/TaskDialog";
import { TaskDisplay } from "./task/TaskDisplay";
import { AuthDialog } from "../database/Auth";
import { TagServer } from "../database/Tag";

export enum Popup {
	TASK,
	TAG,
	AUTH,
}

export const PopupHandler: React.FC = () => {
	const [popups, setPopups] = useState<Popup[]>([Popup.AUTH]);
	const [editingTask, setEditingTask] = useState<Task | undefined>();

	useEffect(() => {
		DialogRemote.init(setEditingTask, showPopup, hidePopup);
	}, []);
	useEffect(() => {
		if (editingTask) showPopup(Popup.TASK);
	}, [editingTask]);

	const showPopup = (popup: Popup) => {
		if (isVisible(popup)) return;
		const newPopups = [popup, ...popups];
		setPopups(newPopups);
	};

	const hidePopup = (popup: Popup) => {
		// console.log( TagServer.getAllTags())
		const newPopups = popups.filter((p_popup) => p_popup !== popup);
		setPopups(newPopups);
	};

	const isVisible = (popup: Popup): boolean => {
		return popups && popups[0] === popup;
	};

	const showNewTaskDialog = (): void => {
		const newTask = TaskServer.getNewTask();
		console.log("Created new task", newTask);
		setEditingTask(newTask);
		// showPopup(Popup.TASK);
	};

	return (
		<>
			{/* <TaskDialogHandler database={appDatabase} /> */}
			<TaskDialog
				isVisible={isVisible(Popup.TASK)}
				hide={() => hidePopup(Popup.TASK)}
				task={editingTask}
				key={editingTask ? editingTask.id : ""}
			/>
			<TagDialog
				isVisible={isVisible(Popup.TAG)}
				hide={() => hidePopup(Popup.TAG)}
			/>
			<AuthDialog
				isVisible={isVisible(Popup.AUTH)}
				hide={() => hidePopup(Popup.AUTH)}
			/>
			<SpeedDialApp
				showTaskDialog={showNewTaskDialog}
				showTagDialog={() => showPopup(Popup.TAG)}
				showAuthDialog={() => showPopup(Popup.AUTH)}
			/>
		</>
	);
};

interface SpeedDialAppProps {
	showTaskDialog: () => void;
	showTagDialog: () => void;
	showAuthDialog: () => void;
}

export const SpeedDialApp: React.FC<SpeedDialAppProps> = ({
	showTaskDialog,
	showTagDialog,
	showAuthDialog,
}) => (
	<SpeedDial
		ariaLabel="SpeedDial"
		icon={<SpeedDialIcon />}
		sx={{ position: "fixed", bottom: "2em", right: "2em" }}
	>
		<SpeedDialAction
			icon={<Add />}
			tooltipTitle="Nova nota"
			onClick={showTaskDialog}
		/>
		<SpeedDialAction
			icon={<Settings />}
			tooltipTitle="Editar tags"
			onClick={showTagDialog}
		/>
		<SpeedDialAction
			icon={<ManageAccounts />}
			tooltipTitle="Configurar conta"
			onClick={showAuthDialog}
		/>
	</SpeedDial>
);

export class DialogRemote {
	protected setEditingTask: React.Dispatch<
		React.SetStateAction<Task | undefined>
	>;
	protected _showPopup: (popup: Popup) => void;
	protected _hidePopup: (popup: Popup) => void;

	private static instance: DialogRemote;

	constructor(
		setEditingTask: React.Dispatch<React.SetStateAction<Task | undefined>>,
		showPopup: (popup: Popup) => void,
		hidePopup: (popup: Popup) => void,
	) {
		this.setEditingTask = setEditingTask;
		this._showPopup = showPopup;
		this._hidePopup = hidePopup;
	}

	public static init = (
		setEditingTask: React.Dispatch<React.SetStateAction<Task | undefined>>,
		showPopup: (popup: Popup) => void,
		hidePopup: (popup: Popup) => void
	): void => {
		if (DialogRemote.instance) return;
		DialogRemote.instance = new DialogRemote(setEditingTask, showPopup, hidePopup);
	};

	public static editTask = (task: Task): void => {
		DialogRemote.instance.setEditingTask(task);
	};

	public static showPopup = (popup: Popup): void => {
		DialogRemote.instance._showPopup(popup);
	}

	public static hidePopup = (popup: Popup): void => {
		DialogRemote.instance._hidePopup(popup);
	}
}
