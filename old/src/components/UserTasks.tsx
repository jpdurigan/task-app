import { Keyframes } from "@emotion/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Container, IconButton } from "@mui/material";
import { Box, keyframes, SxProps } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import { TaskList } from "./task/TaskList";
import { Tag, TagServer } from "../database/Tag";
import { Task, TaskServer } from "../database/Task";
import { DataContext, Data } from "../database/DataProvider";

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

export const UserTasks: React.FC = () => {
	const { tags } = useContext(DataContext) as Data;
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		TaskServer.init(tasks, setTasks);
	}, []);

	useEffect(() => {
		TaskServer.updateTasks(tasks);
		console.log("useEffect TASKS ", tasks);
	}, [tasks]);

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

	const wrapIndex = (idx: number, arr: any[] = tagsToDisplay()): number =>
		((idx % arr.length) + arr.length) % arr.length;

	const moveRight = () => {
		setMovement(+1);
		setIndex(wrapIndex(index + 1));
	};
	const moveLeft = () => {
		setMovement(-1);
		setIndex(wrapIndex(index - 1));
	};
	const getPrevIndex = () => wrapIndex(index - movement);

	const tagsToDisplay = (): (Tag | undefined)[] => [
		undefined,
		...tags.value,
	];

	const getCurrentTag = (): Tag | undefined => {
		return tagsToDisplay()[index];
	};
	const getPreviousTag = (): Tag | undefined => {
		return tagsToDisplay()[getPrevIndex()];
	};

	const getCurrentTagName = (): string => {
		const currentTag = getCurrentTag();
		return currentTag ? currentTag.label : "Todas";
	};
	const getPreviousTagName = (): string => {
		const prevTag = getPreviousTag();
		return prevTag ? prevTag.label : "Todas";
	};

	const getCurrentTagList = (): Task[] => {
		const currentTag = getCurrentTag();
		return currentTag ? TaskServer.getTasksByTag(currentTag.id, tasks) : TaskServer.sortTasks(tasks);
	};
	const getPreviousTagList = (): Task[] => {
		const prevTag = getPreviousTag();
		return prevTag ? TaskServer.getTasksByTag(prevTag.id, tasks) : TaskServer.sortTasks(tasks);
	};

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
					tasks={getPreviousTagList()}
					name={getPreviousTagName()}
					sx={sxList(exitAnimation())}
					key={getPreviousTagName()}
				/>
			)}
			<TaskList
				tasks={getCurrentTagList()}
				name={getCurrentTagName()}
				sx={sxList(enterAnimation())}
				key={getCurrentTagName()}
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
