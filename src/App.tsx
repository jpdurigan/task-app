import React, { useState } from "react";
import { TagDialog } from "./components/tag/TagDialog";
import { ThemeApp } from "./components/Theme";
import { exampleData, Note } from "./components/Model";
import { HeaderApp } from "./components/HeaderApp";
import { NoteDialog } from "./components/note/NoteDialog";
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
	const [notes, setNotes] = useState<Note[]>(exampleData);

	return (
		<ThemeApp>
			<div className="App">
				<HeaderApp />
				<Divider />
				<Container>
					<Box sx={{ minWidth: 200 }}>
						<Box
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							sx={{ minHeight: 80 }}
						>
							<FormatListBulleted fontSize="large" />
							<Typography variant="button">A fazer</Typography>
						</Box>
						<Divider variant="middle" />
						<Box
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							padding={2}
							gap={2}
						>
							<Paper elevation={3} sx={{ maxWidth: 300, padding: "1em" }}>
								<Typography fontSize="1.5em">
									Entregar trabalho no escaninho
								</Typography>
								<Stack direction="row" spacing={1}>
									<Chip label="Universidade" />
									<Chip label="Universidade" />
								</Stack>
							</Paper>
							<Paper elevation={3} sx={{ maxWidth: 300, padding: "1em" }}>
								<Typography fontSize="1.5em">
									Entregar trabalho no escaninho
								</Typography>
								<Stack direction="row" spacing={1}>
									<Chip label="Universidade" />
									<Chip label="Universidade" />
								</Stack>
							</Paper>
						</Box>
					</Box>
				</Container>
				{/* <NoteDialog />
				<TagDialog /> */}
			</div>
		</ThemeApp>
	);
};

export default App;
