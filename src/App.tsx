import React, { useState } from "react";
import { TagDialog } from "./components/tag/TagDialog";
import { ThemeApp } from "./components/Theme";
import { exampleData, Tag, Task } from "./components/Model";
import { HeaderApp } from "./components/HeaderApp";
import { NoteDialog } from "./components/task/TaskDialog";
import {
	Chip,
	Container,
	Divider,
	Paper,
	Stack,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import { border, Box } from "@mui/system";
import { FormatListBulleted } from "@mui/icons-material";

const App: React.FC = () => {
	const [tags, setTags] = useState<Tag[]>();
	const [tasks, setTasks] = useState<Task[]>(exampleData);

	return (
		<ThemeApp>
			<div className="App">
				<HeaderApp />
				{/* <Divider /> */}
				<Container
					sx={{
						display: "flex",
						overflow: "auto",
						justifyContent: "space-evenly",
					}}
				>
					<Box sx={{ minWidth: 300 }}>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							sx={{ minHeight: 80 }}
						>
							<>
								<FormatListBulleted fontSize="large" />
								<Typography variant="button">A fazer</Typography>
								{tasks.map((task) => (
									<TaskBox task={task} />
								))}
							</>
						</Box>
						{/* <Divider variant="middle" /> */}
					</Box>
				</Container>
				{/* <NoteDialog />
				<TagDialog /> */}
			</div>
		</ThemeApp>
	);
};

interface TaskBoxProps {
	task: Task;
}
const TaskBox: React.FC<TaskBoxProps> = ({ task }) => {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			padding={2}
			gap={2}
		>
			<Paper
				elevation={3}
				sx={{ width: 300, padding: "1em" }}
			>
				<Typography fontSize="1.5em">{task.text}</Typography>
				<Stack direction="row" spacing={1}>
					<Chip label="Universidade" />
					<Chip label="Universidade" />
				</Stack>
			</Paper>
		</Box>
	);
};

export default App;
