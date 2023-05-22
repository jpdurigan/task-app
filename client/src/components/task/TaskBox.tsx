import { Edit, CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { Box, Paper, Typography, Stack, IconButton } from "@mui/material";
import { Database } from "../../database/Database";
import { Task, TaskServer } from "../../database/Task";
import { TagStack } from "../tag/TagStack";
import { Palette } from "../../database/Theme";
import { DialogRemote } from "../PopupHandler";

interface TaskBoxProps {
	task: Task;
}

export const TaskBox: React.FC<TaskBoxProps> = ({ task }) => {
	return (
		<Paper
			elevation={3}
			sx={{
				width: 300,
				padding: "1em",
				backgroundColor: task.done ? Palette["primary"][50] : "inherit",
				color: task.done ? "GrayText" : "inherit",
			}}
		>
			<Typography fontSize="1.5em">{task.text}</Typography>
			<TagStack
				tagList={task.tags}
				sx={{ margin: ".5em 0", justifyContent: "flex-end" }}
				disabled={task.done}
			/>
			<Stack direction="row">
				<Box component="span" textAlign="left" width="100%">
					<IconButton
						onClick={() =>
							DialogRemote.editTask(TaskServer.getCloneTask(task.id))
						}
					>
						<Edit />
					</IconButton>
				</Box>
				<Box component="span" textAlign="right">
					<IconButton
						onClick={() => TaskServer.updateTaskDone(task.id, !task.done)}
					>
						{task.done ? <CheckBox /> : <CheckBoxOutlineBlank />}
					</IconButton>
				</Box>
			</Stack>
		</Paper>
	);
};
