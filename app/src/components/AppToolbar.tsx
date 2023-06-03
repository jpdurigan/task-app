import {
	AccountCircle,
	Share,
	AddBox,
	FilterAlt,
	Palette,
	Check,
	CheckBox,
	Warning,
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
	Slide,
	Collapse,
	Grow,
	Alert,
} from "@mui/material";
import { useRef, useState } from "react";
import { AppDialogs, AppFilterDone } from "../AppGlobals";
import { Tag } from "../database/Tag";
import { isReadOnly } from "../database/Firebase";

interface AppToolbarProps {
	showDialog: (dialog: AppDialogs) => void;
	allTags: Tag[];

	filterDone: AppFilterDone;
	setFilterDone: (value: AppFilterDone) => void;
	filterTags: string[];
	setFilterTags: (value: string[]) => void;
}

export const AppToolbar: React.FC<AppToolbarProps> = ({
	showDialog,
	allTags,
	filterDone,
	setFilterDone,
	filterTags,
	setFilterTags,
}) => {
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [filterButton, setFilterButton] = useState<null | HTMLElement>(null);

	const onFilterClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setFilterButton(event.currentTarget);
		setShowFilters((current) => !current);
	};

	const onFilterDoneChange = (
		_event: React.ChangeEvent<HTMLInputElement>,
		value: string
	) => {
		setFilterDone(value as AppFilterDone);
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
							disabled={isReadOnly()}
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
							disabled={isReadOnly()}
							onClick={() => {
								showDialog(AppDialogs.TASK);
							}}
						>
							<AddBox />
						</IconButton>
					</Tooltip>
					<Tooltip title="Filtrar tarefas">
						<IconButton onClick={onFilterClick}>
							<FilterAlt color={showFilters ? "primary" : "action"} />
						</IconButton>
					</Tooltip>
					<Tooltip title="Editar tags">
						<IconButton
							disabled={isReadOnly()}
							onClick={() => {
								showDialog(AppDialogs.TAGS);
							}}
						>
							<Palette />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>
			<Popper
				open={showFilters}
				anchorEl={filterButton}
				placement="bottom-end"
				transition
				keepMounted
			>
				{({ TransitionProps }) => (
					<Collapse {...TransitionProps}>
						<Card sx={{ p: 2 }}>
							<RadioGroup value={filterDone} onChange={onFilterDoneChange}>
								<FormControlLabel
									value={AppFilterDone.ALL}
									control={<FilterRadio />}
									label="Todas"
									labelPlacement="start"
								/>
								<FormControlLabel
									value={AppFilterDone.NOT_DONE}
									control={<FilterRadio />}
									label="Não-concluídas"
									labelPlacement="start"
								/>
								<FormControlLabel
									value={AppFilterDone.DONE}
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
					</Collapse>
				)}
			</Popper>
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
