import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { TagStack } from "../tag/TagStack";
import { Tag } from "../database/Tag";
import { TagColors } from "../Theme";

interface TaskBoxProps {
	tagIds: string[];
	text: string;
	done: boolean;
}

export const TaskBox: React.FC<TaskBoxProps> = ({ tagIds, text, done }) => {
	const tags: Tag[] = tagIds.map(
		(tagId) => new Tag(tagId, "tag", TagColors.BLUE, 1)
	);

	return (
		<Card>
			<CardActionArea>
				<CardContent>
					<TagStack tags={tags} />
					<Typography variant="h6">{text}</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};
