import { Add, Settings } from "@mui/icons-material";
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { Database } from "./Database";

interface SpeedDialAppProps {
	database: Database;
}

export const SpeedDialApp: React.FC<SpeedDialAppProps> = ({ database }) => (
	<SpeedDial
		ariaLabel="SpeedDial"
		icon={<SpeedDialIcon />}
		sx={{ position: "fixed", bottom: "2em", right: "2em" }}
	>
		<SpeedDialAction
			icon={<Add />}
			tooltipTitle="Nova nota"
			onClick={() => database.setEditingTask(-1)}
		/>
		<SpeedDialAction
			icon={<Settings />}
			tooltipTitle="Editar tags"
			onClick={() => database.setShowTagsDialog(true)}
		/>
	</SpeedDial>
);
