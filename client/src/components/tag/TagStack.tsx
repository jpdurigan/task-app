import { Stack, Chip, SxProps, Theme } from "@mui/material";
import { Database } from "../Database";
import { Tag } from "../Model";
import { ThemeApp } from "../Theme";

interface TagStackProps {
	tagList: number[];
	database: Database;
    sx?: SxProps<Theme>;
	disabled?: boolean;
}

export const TagStack: React.FC<TagStackProps> = ({ tagList, database, sx, disabled }) => {
	const sortedTags : Tag[] = database.sortTags(tagList.map((id: number) => database.getTag(id)));
	return (
		<Stack direction="row" gap={1} sx={sx !== undefined ? sx : {}} >
			{sortedTags.map((tag: Tag) => (
				<ThemeApp color={tag.color} key={tag.id}>
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
