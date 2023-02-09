import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Container, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Database } from "../Database";
import { TaskList } from "./TaskList";

const sxMain = { transform: "", opacity: 1 };
const sxPrev = { transform: "translate(-10%, 64px)", opacity: 0.5 };
const sxProx = { transform: "translate(+10%, 64px)", opacity: 0.5 };

interface TaskDisplayProps {
	database: Database;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ database }) => {
	const [index, setIndex] = useState<number>(0);

	const wrapIndex = (idx: number, arr: any[]): number =>
		((idx % arr.length) + arr.length) % arr.length;

	const getProx = (): number =>
		wrapIndex(index + 1, database.getTagsForDisplay());
	const getPrev = (): number =>
		wrapIndex(index - 1, database.getTagsForDisplay());

	const moveToProx = () => setIndex(getProx());
	const moveToPrev = () => setIndex(getPrev());

	return (
		<Container
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "start",
				gap: "4em",
			}}
		>
			<Box
				sx={{
					minWidth: 300,
					minHeight: 60,
					position: "absolute",
					top: "150px",
					left: "50%",
					transform: "translate(-50%, 0%)",

					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<IconButton onClick={moveToPrev}>
					<ChevronLeft />
				</IconButton>
				<IconButton onClick={moveToProx}>
					<ChevronRight />
				</IconButton>
			</Box>
			<TaskList
				database={database}
				tagId={database.getTagsForDisplay()[getPrev()]}
				sx={sxPrev}
			/>
			<TaskList
				database={database}
				tagId={database.getTagsForDisplay()[index]}
				sx={sxMain}
			/>
			<TaskList
				database={database}
				tagId={database.getTagsForDisplay()[getProx()]}
				sx={sxProx}
			/>
		</Container>
	);
};
