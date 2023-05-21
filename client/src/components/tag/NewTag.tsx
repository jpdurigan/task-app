import { Add } from "@mui/icons-material";
import { Box, TextField, IconButton } from "@mui/material";
import { useState } from "react";
import { Tag } from "../../database/Model";

interface NewTagProps {
	tags: Tag[];
	addNewTag: (newLabel: string) => void;
}

export const NewTag: React.FC<NewTagProps> = ({ tags, addNewTag }) => {
	const [newLabel, setNewLabel] = useState<string>("");

	const isValidTag = (): boolean => {
		let isValid = true;
		tags.forEach((tag) => {
			if (tag.label === newLabel) {
				isValid = false;
			}
		});
		return isValid;
	};

	const submitTag = (): void => {
		addNewTag(newLabel);
		setNewLabel("");
	};

	return (
		<Box
			display="flex"
			alignItems="center"
			gap={1}
			component="form"
			onSubmit={(e) => {
				e.preventDefault();
				submitTag();
			}}
		>
			<TextField
				fullWidth
				error={!isValidTag()}
				label={
					newLabel === "" || isValidTag()
						? "Adicionar nova tag"
						: "Tag inválida"
				}
				variant="standard"
				value={newLabel}
				onChange={(e) => setNewLabel(e.target.value)}
			/>
			<IconButton onClick={() => submitTag()}>
				<Add />
			</IconButton>
		</Box>
	);
};
