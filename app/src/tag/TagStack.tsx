import { Stack, Chip } from "@mui/material";
import { Tag } from "../database/Tag";
import { TagColors } from "../Theme";

interface TagStackProps {
	tags: Tag[];
}

export const TagStack: React.FC<TagStackProps> = ({ tags }) => {
	return (
		<Stack direction="row" justifyContent="flex-end" gap={1} mb={2}>
			{tags.map((tag) => (
				<TagChip label={tag.label} color={tag.color} key={tag.id} />
			))}
		</Stack>
	);
};

interface TagChipProps {
	label: string;
	color: TagColors;
}

const TagChip: React.FC<TagChipProps> = ({ label, color }) => {
	return <Chip label={label} color={color} size="small" />;
};
