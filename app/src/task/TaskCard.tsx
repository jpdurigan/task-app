import {
	BoxProps,
	Card,
	CardActionArea,
	CardContent,
	CardProps,
	Typography,
} from "@mui/material";
import { TagStack } from "../tag/TagStack";
import { Tag } from "../database/Tag";
import { TagColors } from "../Theme";

interface TaskCardProps extends CardProps {
	tagIds: string[];
	text: string;
	done: boolean;
	tags: Tag[];
}

export const TaskCard: React.FC<TaskCardProps> = ({
	tagIds,
	text,
	done,
	tags,
	...cardProps
}) => {
	const taskTags = tagIds.map((tagId) =>
		tags.find((tag) => tag.id === tagId)
	).filter(value => value !== undefined) as Tag[];

	return (
		<Card
			sx={{ backgroundColor: done ? "background.default" : "background.paper" }}
			{...cardProps}
		>
			<CardActionArea>
				<CardContent>
					<TagStack tags={taskTags} justifyContent="flex-end" mb={2} />
					<Typography
						variant="h6"
						sx={{ textDecoration: done ? "line-through" : "none" }}
					>
						{text}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};
