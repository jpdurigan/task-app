import { Edit, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Box, Paper, Typography, Stack, IconButton } from "@mui/material";
import { Database } from "../Database";
import { Task } from "../Model";
import { TagStack } from "../tag/TagStack";

interface TaskBoxProps {
	task: Task;
	database: Database;
}

export const TaskBox: React.FC<TaskBoxProps> = ({ task, database }) => {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			padding={2}
			gap={2}
		>
			<Paper elevation={3} sx={{ width: 300, padding: "1em" }}>
				<Typography fontSize="1.5em">{task.text}</Typography>
				<TagStack
					tagList={task.tags}
					database={database}
					sx={{ margin: "1em 0", justifyContent: "flex-end" }}
				/>
				<Stack direction="row">
					<Box component="span" textAlign="left" width="100%">
						<IconButton>
							<Edit />
						</IconButton>
					</Box>
					<Box component="span" textAlign="right">
						<IconButton>
							<CheckBoxOutlineBlank />
						</IconButton>
					</Box>
				</Stack>
			</Paper>
		</Box>
	);
};