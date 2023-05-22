import { Add, ManageAccounts, Settings } from "@mui/icons-material";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { useEffect, useState } from "react";
import { Task, TaskServer } from "../database/Task";
import { TagDialog } from "./TagDialog";
import { TaskDialog } from "./TaskDialog";
import { AuthDialog } from "./AuthDialog";

export enum DialogApp {
	TASK,
	TAG,
	AUTH,
}

export const DialogHandler: React.FC = () => {
	const [dialogs, setDialogs] = useState<DialogApp[]>([DialogApp.AUTH]);
	const [editingTask, setEditingTask] = useState<Task | undefined>();

	useEffect(() => {
		DialogRemote.init(setEditingTask, showDialog, hideDialog);
	}, []);
	useEffect(() => {
		if (editingTask) showDialog(DialogApp.TASK);
	}, [editingTask]);

	const showDialog = (dialog: DialogApp) => {
		if (isVisible(dialog)) return;
		const newDialogs = [dialog, ...dialogs];
		setDialogs(newDialogs);
	};

	const hideDialog = (dialog: DialogApp) => {
		// console.log( TagServer.getAllTags())
		const newDialogs = dialogs.filter((p_dialog) => p_dialog !== dialog);
		setDialogs(newDialogs);
	};

	const isVisible = (dialog: DialogApp): boolean => {
		return dialogs && dialogs[0] === dialog;
	};

	const showNewTaskDialog = (): void => {
		const newTask = TaskServer.getNewTask();
		console.log("Created new task", newTask);
		setEditingTask(newTask);
		// showDialog(DialogApp.TASK);
	};

	return (
		<>
			{/* <TaskDialogHandler database={appDatabase} /> */}
			<TaskDialog
				isVisible={isVisible(DialogApp.TASK)}
				hide={() => hideDialog(DialogApp.TASK)}
				task={editingTask}
				key={editingTask ? editingTask.id : ""}
			/>
			<TagDialog
				isVisible={isVisible(DialogApp.TAG)}
				hide={() => hideDialog(DialogApp.TAG)}
			/>
			<AuthDialog
				isVisible={isVisible(DialogApp.AUTH)}
				hide={() => hideDialog(DialogApp.AUTH)}
			/>
			<SpeedDialApp
				showTaskDialog={showNewTaskDialog}
				showTagDialog={() => showDialog(DialogApp.TAG)}
				showAuthDialog={() => showDialog(DialogApp.AUTH)}
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
	protected _showDialog: (dialog: DialogApp) => void;
	protected _hideDialog: (dialog: DialogApp) => void;

	private static instance: DialogRemote;

	constructor(
		setEditingTask: React.Dispatch<React.SetStateAction<Task | undefined>>,
		showDialog: (dialog: DialogApp) => void,
		hideDialog: (dialog: DialogApp) => void,
	) {
		this.setEditingTask = setEditingTask;
		this._showDialog = showDialog;
		this._hideDialog = hideDialog;
	}

	public static init = (
		setEditingTask: React.Dispatch<React.SetStateAction<Task | undefined>>,
		showDialog: (dialog: DialogApp) => void,
		hideDialog: (dialog: DialogApp) => void
	): void => {
		if (DialogRemote.instance) return;
		DialogRemote.instance = new DialogRemote(setEditingTask, showDialog, hideDialog);
	};

	public static editTask = (task: Task): void => {
		DialogRemote.instance.setEditingTask(task);
	};

	public static showDialog = (dialog: DialogApp): void => {
		DialogRemote.instance._showDialog(dialog);
	}

	public static hideDialog = (dialog: DialogApp): void => {
		DialogRemote.instance._hideDialog(dialog);
	}
}
