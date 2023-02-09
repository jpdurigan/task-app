import { FormatListBulleted } from "@mui/icons-material";
import { Badge, Box, SxProps, Typography } from "@mui/material";
import { Database } from "../Database";
import { Task } from "../Model";
import { TaskBox } from "./TaskBox";

interface TaskLinkProps {
	database: Database;
	tagId?: number;
	sx?: SxProps;
}

export const TaskList: React.FC<TaskLinkProps> = ({ database, tagId, sx }) => {
	const tasks: Task[] =
		tagId === undefined ? database.sortTasks() : database.getTasksByTag(tagId);
	const displayName: string =
		tagId === undefined ? "Todas as notas" : database.getTag(tagId).label;
	const toDoCount: number = tasks.filter((task) => !task.done).length;

	return (
		<Box sx={{ minWidth: 300, ...sx }}>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				minHeight="60px"
			>
				<Badge badgeContent={toDoCount} color="primary">
				<FormatListBulleted fontSize="large" />
				</Badge>
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
					<TaskBox task={task} database={database} key={task.id} />
				))}
			</Box>
		</Box>
	);
};
