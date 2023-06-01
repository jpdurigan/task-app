import { Add } from "@mui/icons-material";
import { Box, TextField, IconButton } from "@mui/material";
import { useContext, useState } from "react";
import { TagServer } from "../../database/Tag";
import { DataContext, Data } from "../../database/DataProvider";

export const TagNew: React.FC = () => {
	const { tags } = useContext(DataContext) as Data;
	const [newLabel, setNewLabel] = useState<string>("");

	const isValidTag = (): boolean => {
		if (newLabel === "") return false;
		let isValid = true;
		tags.value.forEach((tag) => {
			if (tag.label === newLabel) {
				isValid = false;
			}
		});
		return isValid;
	};

	const submitTag = (): void => {
		const tag = TagServer.getNewTag();
		tag.label = newLabel;
		tags.create(tag);
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
