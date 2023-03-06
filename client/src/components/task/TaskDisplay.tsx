import { Keyframes } from "@emotion/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Container, IconButton } from "@mui/material";
import { Box, keyframes, SxProps } from "@mui/system";
import { useState } from "react";
import { Database } from "../Database";
import { TaskList } from "./TaskList";

const framePrev = {
	opacity: 0.0,
	transform: "translate(-110%, 0)",
	display: "none",
};
const frameMain = { opacity: 1.0, transform: "translate(   0, 0)" };
const frameProx = {
	opacity: 0.0,
	transform: "translate(+110%, 0)",
	display: "none",
};

const enterDefault = keyframes`
0% {
	${frameMain}
}
`;

const enterLeft = keyframes`
0% {
	${framePrev}
}
100% {
	${frameMain}
}
`;

const enterRight = keyframes`
0% {
	${frameProx}
}
100% {
	${frameMain}
}
`;

const exitDefault = keyframes`
0%, 100% {
	${frameProx}
}
`;

const exitLeft = keyframes`
0% {
	${frameMain}
}
100% {
	${frameProx}
}
`;

const exitRight = keyframes`
0% {
	${frameMain}
}
100% {
	${framePrev}
}
`;

interface TaskDisplayProps {
	database: Database;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ database }) => {
	const [index, setIndex] = useState<number>(0);
	const [movement, setMovement] = useState<-1 | 0 | 1>(0);

	const enterAnimation = (): Keyframes => {
		switch (movement) {
			case -1:
				return enterLeft;
			case 1:
				return enterRight;
			default:
				return enterDefault;
		}
	};

	const exitAnimation = (): Keyframes => {
		switch (movement) {
			case -1:
				return exitLeft;
			case 1:
				return exitRight;
			default:
				return exitDefault;
		}
	};

	const sxList = (animation: Keyframes): SxProps => {
		return {
			position: "absolute",
			animation: `${animation} 600ms cubic-bezier(0.31, 0.95, 0.7, 1.07) forwards`,
		};
	};

	const wrapIndex = (
		idx: number,
		arr: any[] = database.getTagsForDisplay()
	): number => ((idx % arr.length) + arr.length) % arr.length;

	const moveRight = () => {
		setMovement(+1);
		setIndex(wrapIndex(index + 1));
	};
	const moveLeft = () => {
		setMovement(-1);
		setIndex(wrapIndex(index - 1));
	};
	const getPrev = () => wrapIndex(index - movement);

	return (
		<Container
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "start",
				gap: "4em",
			}}
		>
			{movement !== 0 && (
				<TaskList
					database={database}
					tagId={database.getTagsForDisplay()[getPrev()]}
					sx={sxList(exitAnimation())}
					key={getPrev()}
				/>
			)}
			<TaskList
				database={database}
				tagId={database.getTagsForDisplay()[index]}
				sx={sxList(enterAnimation())}
				key={index}
			/>
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
				<IconButton onClick={moveLeft}>
					<ChevronLeft />
				</IconButton>
				<IconButton onClick={moveRight}>
					<ChevronRight />
				</IconButton>
			</Box>
		</Container>
	);
};
