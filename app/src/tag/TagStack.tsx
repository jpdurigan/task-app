import { Stack, Chip, StackProps } from "@mui/material";
import { Tag } from "../database/Tag";
import { TagColors } from "../Theme";

interface TagStackProps extends StackProps {
	tags: Tag[];
}

export const TagStack: React.FC<TagStackProps> = (props) => {
	const { tags } = props;
	return (
		<Stack direction="row" gap={1} {...props}>
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
