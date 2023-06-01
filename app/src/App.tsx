import {
	AccountCircle,
	AddBox,
	Assignment,
	Edit,
	EditNote,
	Filter,
	FilterAlt,
	Palette,
	Share,
	Sort,
} from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	Checkbox,
	Chip,
	Container,
	Divider,
	IconButton,
	Popper,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";

export const App: React.FC = () => {
	return (
		<>
			<Container maxWidth="xs">
				<Stack direction="row" alignItems="center" justifyContent="right">
					<Assignment sx={{ fontSize: 48 }} />
					<Typography variant="h3" component="h1">
						Tarefas
					</Typography>
				</Stack>
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
							<Tooltip title="Filtrar tarefas">
								<IconButton>
									<FilterAlt />
								</IconButton>
							</Tooltip>
              <Popper open={true}>
                <Box>
                  <Stack>
                    <ButtonGroup orientation="vertical" variant="text">
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
				<Card>
					<CardActionArea>
						<CardContent>
							<Stack direction="row" justifyContent="flex-end" gap={1}>
								<Chip label="Tag 1" size="small" />
								<Chip label="Tag 2" size="small" />
							</Stack>
							<Typography variant="h6">Descrição da tarefa</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</Container>
		</>
	);
};
