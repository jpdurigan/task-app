import { AccountCircle, Share, AddBox, FilterAlt, Palette } from "@mui/icons-material";
import {
	Box,
	Stack,
	Tooltip,
	IconButton,
	Popper,
	ButtonGroup,
	Button,
	Divider,
} from "@mui/material";
import { useRef } from "react";

export const AppToolbar: React.FC = () => {
    const filterButton = useRef<HTMLElement>();

	return (
		<Box mb={2}>
			<Stack direction="row" justifyContent="space-between">
				<Stack direction="row">
					<Tooltip title="Conta">
						<IconButton>
							<AccountCircle />
						</IconButton>
					</Tooltip>
					<Tooltip title="Compartilhar">
						<IconButton>
							<Share />
						</IconButton>
					</Tooltip>
				</Stack>
				<Stack direction="row-reverse">
					<Tooltip title="Nova tarefa">
						<IconButton>
							<AddBox />
						</IconButton>
					</Tooltip>
					<Tooltip title="Filtrar tarefas" ref={filterButton}>
						<IconButton>
							<FilterAlt />
						</IconButton>
					</Tooltip>
					<Popper open={true} anchorEl={filterButton.current} placement="bottom-end">
						<Box p={1} sx={{backgroundColor: "Background"}}>
							<Stack>
								<ButtonGroup orientation="vertical" variant="text" size="small">
									<Button>Botão 1</Button>
									<Button>Botão 2</Button>
								</ButtonGroup>
							</Stack>
						</Box>
					</Popper>
					<Tooltip title="Editar tags">
						<IconButton>
							<Palette />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>
			<Divider />
		</Box>
	);
};
