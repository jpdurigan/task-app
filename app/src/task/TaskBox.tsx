import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { TagStack } from "../tag/TagStack";
import { Tag } from "../database/Tag";
import { TagColors } from "../Theme";

interface TaskBoxProps {
	tagIds: string[];
	text: string;
	done: boolean;
	tags: Tag[];
}

export const TaskBox: React.FC<TaskBoxProps> = ({
	tagIds,
	text,
	done,
	tags,
}) => {
	const taskTags = tagIds.map((tagId) =>
		tags.find((tag) => tag.id === tagId)
	) as Tag[];

	return (
		<Card sx={{ backgroundColor: done ? "background.default" : "background.paper" }}>
			<CardActionArea>
				<CardContent>
					<TagStack tags={taskTags} justifyContent="flex-end" mb={2} />
					<Typography variant="h6" sx={{textDecoration: done ? "line-through" : "none"}}>{text}</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};
