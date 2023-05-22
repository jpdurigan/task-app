import { Stack, Chip, SxProps, Theme } from "@mui/material";
import { Tag, TagServer } from "../../database/Tag";
import { ThemeApp } from "../../database/Theme";

interface TagStackProps {
	tagList: string[];
	sx?: SxProps<Theme>;
	disabled?: boolean;
}

export const TagStack: React.FC<TagStackProps> = ({
	tagList,
	sx,
	disabled,
}) => {
	const sortedTags: Tag[] = TagServer.sortTags(
		tagList.map((id: string) => TagServer.getTag(id) as Tag)
	);
	return (
		<Stack direction="row" gap={1} sx={sx !== undefined ? sx : {}}>
			{sortedTags.map((tag: Tag) => tag && (
				<ThemeApp color_name={tag.color} key={tag.id}>
					<Chip
						label={tag.label}
						color="primary"
						disabled={disabled !== undefined ? disabled : false}
					/>
				</ThemeApp>
			))}
		</Stack>
	);
};
