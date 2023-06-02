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
import { Tag, exampleTags } from "../database/Tag";
import {
	ArrowDownward,
	ArrowUpward,
	Circle,
	Delete,
	Edit,
	Save,
} from "@mui/icons-material";
import { TagColors } from "../Theme";
import { useState } from "react";
import { AppDialogProps } from "../AppGlobals";

interface TagDialogProps extends AppDialogProps {
	allTags?: Tag[];
}

export const TagDialog: React.FC<TagDialogProps> = ({
	isVisible,
	hide,
	allTags,
}) => {
	return (
		<Dialog open={isVisible} onClose={hide} maxWidth="xs" fullWidth>
			<DialogTitle>Editar tags</DialogTitle>
			<DialogContent>
				{/* <DialogContentText textAlign="center" mb={2}>
					Atualizando...
				</DialogContentText> */}
				<Stack gap={1}>
					{allTags &&
						allTags.map((tag) => (
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
				{isEditing ? <Save color={color} /> : <Edit />}
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
