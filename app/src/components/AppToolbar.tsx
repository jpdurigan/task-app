import {
	AccountCircle,
	Share,
	AddBox,
	FilterAlt,
	Palette,
	Check,
	CheckBox,
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
	FormGroup,
	CheckboxProps,
	Checkbox,
} from "@mui/material";
import { useRef, useState } from "react";
import { AppDialogs } from "../AppDialogs";
import { Tag } from "../database/Tag";

enum FilterDone {
	ALL = "ALL",
	NOT_DONE = "NOT_DONE",
	DONE = "DONE",
}

interface AppToolbarProps {
	showDialog: (dialog: AppDialogs) => void;
	allTags: Tag[];
}

export const AppToolbar: React.FC<AppToolbarProps> = ({
	showDialog,
	allTags,
}) => {
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [filterDone, setFilterDone] = useState<FilterDone>(FilterDone.ALL);
	const [filterTags, setFilterTags] = useState<string[]>([]);
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

	const onFilterTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = event.target.checked;
		const targetTagId = event.target.name;
		const isTargetInFilter = filterTags.includes(targetTagId);
		if (isChecked && !isTargetInFilter) {
			setFilterTags([...filterTags, targetTagId]);
		} else if (!isChecked && isTargetInFilter) {
			setFilterTags(filterTags.filter((tag) => tag !== targetTagId));
		}
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
						<IconButton
							onClick={() => {
								showDialog(AppDialogs.SHARE);
							}}
						>
							<Share />
						</IconButton>
					</Tooltip>
				</Stack>
				<Stack direction="row-reverse">
					<Tooltip title="Nova tarefa">
						<IconButton
							onClick={() => {
								showDialog(AppDialogs.TASK);
							}}
						>
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
							<Divider sx={{ my: 1 }} />
							<FormGroup>
								{allTags.map((tag) => (
									<FormControlLabel
										value={tag.id}
										control={
											<FilterCheckbox
												checked={filterTags.includes(tag.id)}
												name={tag.id}
												onChange={onFilterTagsChange}
											/>
										}
										label={tag.label}
										labelPlacement="start"
										key={tag.id}
									/>
								))}
							</FormGroup>
						</Card>
					</Popper>
					<Tooltip title="Editar tags">
						<IconButton
							onClick={() => {
								showDialog(AppDialogs.TAGS);
							}}
						>
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

const FilterCheckbox: React.FC<CheckboxProps> = (props) => {
	return (
		<Checkbox icon={<Icon />} checkedIcon={<Check />} size="small" {...props} />
	);
};
