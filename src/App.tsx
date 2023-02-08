import React, { useState } from "react";
import { TagDialog } from "./components/tag/TagDialog";
import { ThemeApp } from "./components/Theme";
import { exampleData, exampleTags, Tag, Task } from "./components/Model";
import { HeaderApp } from "./components/HeaderApp";
import { TaskDialog } from "./components/task/TaskDialog";
import {
	Chip,
	Container,
	Divider,
	IconButton,
	Paper,
	Select,
	SpeedDial,
	SpeedDialAction,
	SpeedDialIcon,
	Stack,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import { border, Box } from "@mui/system";
import {
	Add,
	CheckBoxOutlineBlank,
	Delete,
	Edit,
	FormatListBulleted,
	Settings,
} from "@mui/icons-material";
import { Database } from "./components/Database";
import { TagStack } from "./components/tag/TagStack";
import { TaskBox } from "./components/task/TaskBox";

const App: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>(exampleData);
	const [tags, setTags] = useState<Tag[]>(exampleTags);
	const [editingTask, setEditingTask] = useState<number | undefined>();
	const [showTagsDialog, setShowTagsDialog] = useState<boolean>(false);

	const appDatabase = new Database(
		tasks,
		setTasks,
		tags,
		setTags,
		editingTask,
		setEditingTask,
		showTagsDialog,
		setShowTagsDialog
	);

	return (
		<ThemeApp>
			<Box className="App">
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
								<Box
									display="flex"
									flexDirection="column"
									alignItems="center"
									justifyContent="center"
									padding={2}
									gap={2}
								>
									{appDatabase.sortTasks().map((task) => (
										<TaskBox task={task} database={appDatabase} />
									))}
								</Box>
							</>
						</Box>
						{/* <Divider variant="middle" /> */}
					</Box>
				</Container>
				{appDatabase.showTaskDialog() ? (
					<TaskDialog database={appDatabase} />
				) : (
					<></>
				)}
				{appDatabase.showTagsDialog ? (
					<TagDialog database={appDatabase} />
				) : (
					<></>
				)}
				<SpeedDial ariaLabel="SpeedDial" icon={<SpeedDialIcon/>} sx={{position: "fixed", bottom: "2em", right: "2em"}}>
					<SpeedDialAction icon={<Add />} tooltipTitle="Nova nota" onClick={() => appDatabase.setEditingTask(-1)} />
					<SpeedDialAction icon={<Settings />} tooltipTitle="Editar tags"  onClick={() => appDatabase.setShowTagsDialog(true)}/>
				</SpeedDial>
			</Box>
		</ThemeApp>
	);
};

export default App;
