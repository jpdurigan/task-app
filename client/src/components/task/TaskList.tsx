import { FormatListBulleted } from "@mui/icons-material";
import { Badge, Box, SxProps, Typography } from "@mui/material";
import { Database } from "../../database/Database";
import { Task, TaskServer } from "../../database/Task";
import { TaskBox } from "./TaskBox";
import { Tag, TagServer } from "../../database/Tag";

interface TaskLinkProps {
	tasks: Task[];
	name: string;
	sx?: SxProps;
}

export const TaskList: React.FC<TaskLinkProps> = ({ tasks, name, sx }) => {
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
				<Typography variant="button">{name}</Typography>
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
					<TaskBox task={task} key={task.id} />
				))}
			</Box>
		</Box>
	);
};
