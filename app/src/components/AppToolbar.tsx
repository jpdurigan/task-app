import {
	AccountCircle,
	Share,
	AddBox,
	FilterAlt,
	Palette,
	Check,
} from "@mui/icons-material";
import {
	Box,
	Stack,
	Tooltip,
	IconButton,
	Popper,
	Divider,
	RadioGroup,
	FormControlLabel,
	Radio,
	Card,
	RadioProps,
	Icon,
} from "@mui/material";
import { useRef, useState } from "react";
import { AppDialogs } from "../AppDialogs";

enum FilterDone {
	ALL = "ALL",
	NOT_DONE = "NOT_DONE",
	DONE = "DONE",
}

interface AppToolbarProps {
	showDialog: (dialog: AppDialogs) => void;
}

export const AppToolbar: React.FC<AppToolbarProps> = ({ showDialog }) => {
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [filterDone, setFilterDone] = useState<FilterDone>(FilterDone.ALL);
	const filterButton = useRef<HTMLElement>();

	const onFilterClick = () => {
		setShowFilters((current) => !current);
	};

	const onFilterDoneChange = (
		_event: React.ChangeEvent<HTMLInputElement>,
		value: string
	) => {
		setFilterDone(value as FilterDone);
	};

	return (
		<Box mb={2}>
			<Stack direction="row" justifyContent="space-between">
				<Stack direction="row">
					<Tooltip title="Conta">
						<IconButton
							onClick={() => {
								showDialog(AppDialogs.AUTH);
							}}
						>
							<AccountCircle />
						</IconButton>
					</Tooltip>
					<Tooltip title="Compartilhar">
						<IconButton onClick={() => {
								showDialog(AppDialogs.SHARE);
							}}>
							<Share />
						</IconButton>
					</Tooltip>
				</Stack>
				<Stack direction="row-reverse">
					<Tooltip title="Nova tarefa">
						<IconButton onClick={() => {
								showDialog(AppDialogs.TASK);
							}}>
							<AddBox />
						</IconButton>
					</Tooltip>
					<Tooltip title="Filtrar tarefas" ref={filterButton}>
						<IconButton onClick={onFilterClick}>
							<FilterAlt color={showFilters ? "primary" : "action"} />
						</IconButton>
					</Tooltip>
					<Popper
						open={showFilters}
						anchorEl={filterButton.current}
						placement="bottom-end"
					>
						<Card sx={{ p: 2 }}>
							<RadioGroup value={filterDone} onChange={onFilterDoneChange}>
								<FormControlLabel
									value={FilterDone.ALL}
									control={<FilterRadio />}
									label="Todas"
									labelPlacement="start"
								/>
								<FormControlLabel
									value={FilterDone.NOT_DONE}
									control={<FilterRadio />}
									label="Não-concluídas"
									labelPlacement="start"
								/>
								<FormControlLabel
									value={FilterDone.DONE}
									control={<FilterRadio />}
									label="Concluídas"
									labelPlacement="start"
								/>
							</RadioGroup>
						</Card>
					</Popper>
					<Tooltip title="Editar tags">
						<IconButton onClick={() => {
								showDialog(AppDialogs.TAGS);
							}}>
							<Palette />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>
			<Divider />
		</Box>
	);
};

const FilterRadio: React.FC<RadioProps> = (props) => {
	return (
		<Radio icon={<Icon />} checkedIcon={<Check />} size="small" {...props} />
	);
};
