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
import { doc, setDoc } from "firebase/firestore";
import { db, getFirebaseUserId, hasFirebaseUser } from "../database/Firebase";
import { TagServer } from "../database/Tag";

export const ShareDialog: React.FC<AppDialogProps> = ({ isVisible, hide }) => {
	const [isShared, setIsShared] = useState<boolean>(false);
	const [isMouseHovering, setIsMouseHovering] = useState<boolean>(false);
	const [sharedLink, setSharedLink] = useState<string | undefined>();
	const [feedbackLabel, setFeedbackLabel] = useState<string | undefined>();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const onSharedChanged = async (
		_event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		setIsShared(checked);
		if (checked) {
			setFeedbackLabel("Habilitando...");
			await updateDocumentsVisibility(true);
			setSharedLink(
				`https://tasks.durigan.jp/?u=${getFirebaseUserId()}`
			);
			setFeedbackLabel(undefined);
		} else {
			setFeedbackLabel("Desabilitando...");
			await updateDocumentsVisibility(false);
			setSharedLink(undefined);
			setFeedbackLabel(undefined);
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
		setFeedbackLabel("Link copiado para área de transferência!");
		setTimeout(hideFeedback, 3000);
	};

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
				<Collapse in={feedbackLabel !== undefined}>
					<DialogContentText mb={2}>{feedbackLabel}</DialogContentText>
				</Collapse>
				<Collapse in={sharedLink !== undefined}>
					<Card
						variant="outlined"
						sx={{ mb: 2, borderColor: "blue" }}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
						onClick={copyToClipboard}
					>
						<CardContent>
							<Stack direction="row" alignItems="center">
								<Typography sx={{wordBreak: "break-all"}}>{sharedLink}</Typography>
								<Grow in={isMouseHovering}>
									<IconButton onClick={copyToClipboard}>
										<ContentCopy />
									</IconButton>
								</Grow>
							</Stack>
						</CardContent>
					</Card>
				</Collapse>
			</DialogContent>
		</Dialog>
	);
};

const updateDocumentsVisibility = async (visible: boolean) => {
	if (!hasFirebaseUser()) return;

	const document = doc(db, "app", getFirebaseUserId());
	const data = {visible}
	try {
		await setDoc(document, data);
		console.log(`Documento atualizado: ${data.toString()}`);
	} catch (err) {
		console.warn("Error saving one on remote");
		console.log(err);
	}
};