import { Stack, Chip, SxProps, Theme } from "@mui/material";
import { Database } from "../../database/Database";
import { Tag } from "../../database/Model";
import { ThemeApp } from "../../database/Theme";

interface TagStackProps {
	tagList: string[];
	database: Database;
	sx?: SxProps<Theme>;
	disabled?: boolean;
}

export const TagStack: React.FC<TagStackProps> = ({
	tagList,
	database,
	sx,
	disabled,
}) => {
	const sortedTags: Tag[] = database.sortTags(
		tagList.map((id: string) => database.getTag(id))
	);
	return (
		<Stack direction="row" gap={1} sx={sx !== undefined ? sx : {}}>
			{sortedTags.map((tag: Tag) => (
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
