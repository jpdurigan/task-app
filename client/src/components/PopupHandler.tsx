import { Add, ManageAccounts, Settings } from "@mui/icons-material";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { Database } from "../database/Database";
import { useState } from "react";
import { Task } from "../database/Task";
import { TagDialog } from "./tag/TagDialog";
import { TaskDialogHandler } from "./task/TaskDialog";
import { TaskDisplay } from "./task/TaskDisplay";
import { AuthDialog } from "../database/Auth";
import { TagServer } from "../database/Tag";

enum Popup {
	TASK,
	TAG,
	AUTH,
}

export const PopupHandler: React.FC = () => {
	const [popups, setPopups] = useState<Popup[]>([Popup.AUTH]);
	const [editingTask, setEditingTask] = useState<Task>();

	const showPopup = (popup: Popup) => {
		const newPopups = [popup, ...popups];
		setPopups(newPopups);
	};

	const hidePopup = (popup: Popup) => {
		console.log( TagServer.getAllTags())
		const newPopups = popups.filter((p_popup) => p_popup !== popup);
		setPopups(newPopups);
	};

	const isVisible = (popup: Popup): boolean => {
		return popups && popups[0] === popup;
	};

	return (
		<>
			{/* <TaskDialogHandler database={appDatabase} /> */}
			<TagDialog
				isVisible={isVisible(Popup.TAG)}
				hide={() => hidePopup(Popup.TAG)}
				// tags={TagServer.getAllTags()}
			/>
			<AuthDialog
				isVisible={isVisible(Popup.AUTH)}
				hide={() => hidePopup(Popup.AUTH)}
			/>
			<SpeedDialApp
				showTaskDialog={() => showPopup(Popup.TASK)}
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
