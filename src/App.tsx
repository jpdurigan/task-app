import { CssBaseline, Divider, ThemeProvider } from "@mui/material";
import React, { useState } from "react";
import { HeaderApp } from "./components/HeaderApp";
import InputField from "./components/InputField";
import { NewNoteDialog } from "./components/NewNoteDialog";
import { Note, NoteCard } from "./components/NoteCard";
import { ThemeApp } from "./components/Theme";

const noteExample: Note = {
	id: 0,
	text: "Nota exemplo",
	done: false,
};

const App: React.FC = () => {
	const [newNote, setNewNote] = useState<string>("");
	const [notes, setNotes] = useState<Note[]>([noteExample]);

	const addNote = (text: string): void => {
		if (text.trim().length === 0) return;
		const id: number = Math.floor(Math.random() * 100000000);
		const note: Note = {
			id: id,
			text: text.trim(),
			done: false,
		};
		setNotes([...notes, note]);
	};

	const deleteNote = (id: number): void => {
		setNotes(notes.filter((note) => note.id !== id));
	};

	const editNote = (id: number, text: string, done: boolean): void => {
		setNotes(
			notes.map((note) => {
				if (note.id === id) {
					note.text = text;
					note.done = done;
				}
				return note;
			})
		);
	};

	return (
		<ThemeApp>
			<div className="App">
				{/* <HeaderApp /> */}
				{/* <h1 className="center-align">Minhas notas</h1> */}
				{/* <InputField
					currentValue={newNote}
					setCurrentValue={setNewNote}
					add={addNote}
				/> */}
				{/* <Divider /> */}
				{/* <div className="container section row s-grid-gap">
					{notes.map((note: Note) => (
						<NoteCard
							id={note.id}
							text={note.text}
							done={note.done}
							edit={editNote}
							delete={deleteNote}
						/>
					))}
				</div> */}
				<NewNoteDialog />
			</div>
		</ThemeApp>
	);
};

export default App;
