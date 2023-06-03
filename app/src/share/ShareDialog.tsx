import {
	Card,
	CardActionArea,
	CardContent,
	Collapse,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	Grow,
	IconButton,
	Popover,
	Popper,
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import { AppDialogProps } from "../AppGlobals";
import { useState } from "react";
import { ContentCopy } from "@mui/icons-material";

export const ShareDialog: React.FC<AppDialogProps> = ({ isVisible, hide }) => {
	const [isShared, setIsShared] = useState<boolean>(false);
	const [isMouseHovering, setIsMouseHovering] = useState<boolean>(false);
    const [sharedLink, setSharedLink] = useState<string | undefined>("https://tasks.durigan.jp/?u=159efad9-f041-406e-8bab-ea25001a0043");
	const [feedbackLabel, setFeedbackLabel] = useState<string | undefined>();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const onSharedChanged = (
		_event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		setIsShared(checked);
		if (checked) {
			setFeedbackLabel("Habilitando...");
		} else {
			setFeedbackLabel("Desabilitando...");
		}
	};

	const onMouseEnter = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		setIsMouseHovering(true);
		setAnchorEl(event.currentTarget);
	};

	const onMouseLeave = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		setIsMouseHovering(false);
	};

    const copyToClipboard = () => {
        if (!sharedLink) return;
        navigator.clipboard.writeText(sharedLink);
        setFeedbackLabel("Link copiado para área de transferência!")
        setTimeout(hideFeedback, 3000);
    }

    const hideFeedback = () => setFeedbackLabel(undefined);

	return (
		<Dialog open={isVisible} onClose={hide} maxWidth="xs" fullWidth>
			<DialogTitle>Compartilhar</DialogTitle>
			<DialogContent>
				<FormControlLabel
					control={<Switch checked={isShared} onChange={onSharedChanged} />}
					label="Compartilhar tarefas?"
					sx={{ mb: 2 }}
				/>
				<Card
					variant="outlined"
					sx={{ mb: 2, borderColor: "blue" }}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
                    onClick={copyToClipboard}
				>
					<CardContent>
						<Stack direction="row" alignItems="center">
							<Typography>
								{sharedLink}
							</Typography>
                            <Grow in={isMouseHovering}>
								<IconButton onClick={copyToClipboard}>
									<ContentCopy />
								</IconButton>
                            </Grow>
						</Stack>
					</CardContent>
				</Card>
				<Collapse in={feedbackLabel !== undefined}>
					<DialogContentText mb={2}>{feedbackLabel}</DialogContentText>
				</Collapse>
			</DialogContent>
		</Dialog>
	);
};
