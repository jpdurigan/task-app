import { FormatListBulleted } from "@mui/icons-material";
import { Box, SxProps, Typography } from "@mui/material";
import { Database } from "../Database";
import { Task } from "../Model";
import { TaskBox } from "./TaskBox";

interface TaskDisplayProps {
	database: Database;
	tagId?: number;
	sx?: SxProps;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({
	database,
	tagId,
	sx,
}) => {
    const tasks: Task[] = tagId === undefined ? database.sortTasks() : database.getTasksByTag(tagId);
    const displayName: string = tagId === undefined ? "Todas as notas" : database.getTag(tagId).label;

	return (
		<Box sx={{ minWidth: 300, ...sx }}>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
			>
				<FormatListBulleted fontSize="large" />
				<Typography variant="button">{displayName}</Typography>
			</Box>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				padding={2}
				gap={2}
			>
				{tasks.map((task) => (
					<TaskBox task={task} database={database} />
				))}
			</Box>
		</Box>
	);
};
