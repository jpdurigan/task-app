import { Stack, Chip, SxProps, Theme } from "@mui/material";
import { Database } from "../Database";
import { ThemeApp } from "../Theme";

interface TagStackProps {
	tagList: number[];
	database: Database;
    sx?: SxProps<Theme>;
}

export const TagStack: React.FC<TagStackProps> = ({ tagList, database, sx }) => {
	return (
		<Stack direction="row" gap={1} sx={sx !== undefined ? sx : {}} >
			{tagList.map((id: number) => (
				<ThemeApp color={database.getTag(id).color}>
					<Chip
						label={database.getTag(id).label}
						key={`new-note-selected-tag-${id}`}
						color="primary"
					/>
				</ThemeApp>
			))}
		</Stack>
	);
};
