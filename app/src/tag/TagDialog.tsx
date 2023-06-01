import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	InputLabel,
	Stack,
	TextField,
} from "@mui/material";
import { exampleTags } from "../database/Tag";
import { ArrowDownward, ArrowUpward, Circle, Delete, Edit } from "@mui/icons-material";
import { TagColors } from "../Theme";
import { useState } from "react";
import { AppDialogProps } from "../AppDialogs";

export const TagDialog: React.FC<AppDialogProps> = ({isVisible, hide}) => {
	const tags = exampleTags;

	return (
		<Dialog open={isVisible} onClose={hide} maxWidth="xs">
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent>
				{/* <DialogContentText textAlign="center" mb={2}>
					Atualizando...
				</DialogContentText> */}
				<Stack gap={1}>
					{tags.map((tag) => (
						<TagDialogEdit label={tag.label} color={tag.color} key={tag.id} />
					))}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button>Adicionar nova tag</Button>
			</DialogActions>
		</Dialog>
	);
};

interface TagDialogEditProps {
	label: string;
	color: TagColors;
}

const TagDialogEdit: React.FC<TagDialogEditProps> = ({ label, color }) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);

	return (
		<Stack direction="row" gap={1}>
			<IconButton onClick={() => setIsEditing(!isEditing)}>
				<Edit color={isEditing ? color : "action"} />
			</IconButton>
            <IconButton disabled={!isEditing}>
				<ArrowUpward color={isEditing ? color : "disabled"} />
			</IconButton>
            <IconButton disabled={!isEditing}>
				<ArrowDownward color={isEditing ? color : "disabled"} />
			</IconButton>
			<TextField
				size="small"
				color={color}
				fullWidth
				value={label}
				disabled={!isEditing}
			/>
			<IconButton disabled={!isEditing}>
				<Circle color={color} />
			</IconButton>
			<IconButton disabled={!isEditing}>
				<Delete color={isEditing ? color : "disabled"} />
			</IconButton>
		</Stack>
	);
};
