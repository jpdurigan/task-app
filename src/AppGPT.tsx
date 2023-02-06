import React, { useState } from "react";
import {
	Container,
	Grid,
	Typography,
	TextField,
	Box,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";

interface Task {
	id: number;
	description: string;
	completed: boolean;
}

const Tasks: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [newTask, setNewTask] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setTasks([
			...tasks,
			{ id: tasks.length + 1, description: newTask, completed: false },
		]);
		setNewTask("");
	};

	const handleTaskClick = (id: number) => {
		setTasks(
			tasks.map((task) => {
				if (task.id === id) {
					return { ...task, completed: !task.completed };
				}
				return task;
			})
		);
	};

	return (
		<Container maxWidth="sm">
			<Box my={4}>
				<Typography variant="h3" component="h1" align="center">
					Tasks App
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Add new task"
						value={newTask}
						onChange={(e) => setNewTask(e.target.value)}
						margin="normal"
						variant="outlined"
					/>
				</form>
			</Box>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<Typography variant="h6">To-Do</Typography>
					<List>
						{tasks
							.filter((task) => !task.completed)
							.map((task) => (
								<ListItem
									button
									key={task.id}
									onClick={() => handleTaskClick(task.id)}
								>
									<ListItemText primary={task.description} />
								</ListItem>
							))}
					</List>
				</Grid>
				<Grid item xs={6}>
					<Typography variant="h6">Done</Typography>
					<List>
						{tasks
							.filter((task) => task.completed)
							.map((task) => (
								<ListItem
									button
									key={task.id}
									onClick={() => handleTaskClick(task.id)}
								>
									<ListItemText primary={task.description} />
								</ListItem>
							))}
					</List>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Tasks;
