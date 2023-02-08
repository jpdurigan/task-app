import { Edit, CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { Box, Paper, Typography, Stack, IconButton } from "@mui/material";
import { Database } from "../Database";
import { Task } from "../Model";
import { TagStack } from "../tag/TagStack";
import { ColorsApp } from "../Theme";

interface TaskBoxProps {
	task: Task;
	database: Database;
}

export const TaskBox: React.FC<TaskBoxProps> = ({ task, database }) => {
	return (
		<Paper
			elevation={3}
			sx={{
				width: 300,
				padding: "1em",
				backgroundColor: task.done ? ColorsApp.Primary[50] : "inherit",
                color: task.done ? "GrayText" : "inherit",
			}}
			key={`task-box-${task.id}`}
		>
			<Typography fontSize="1.5em">{task.text}</Typography>
			<TagStack
				tagList={task.tags}
				database={database}
				sx={{ margin: ".5em 0", justifyContent: "flex-end" }}
				disabled={task.done}
			/>
			<Stack direction="row">
				<Box component="span" textAlign="left" width="100%">
					<IconButton onClick={() => database.setEditingTask(task.id)}>
						<Edit />
					</IconButton>
				</Box>
				<Box component="span" textAlign="right">
					<IconButton onClick={() => database.updateTaskDone(task.id, !task.done)}>
						{task.done ? <CheckBox /> : <CheckBoxOutlineBlank />}
					</IconButton>
				</Box>
			</Stack>
		</Paper>
	);
};
