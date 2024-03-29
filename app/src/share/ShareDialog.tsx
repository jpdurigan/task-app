import {
	Card,
	CardContent,
	Collapse,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	Grow,
	IconButton,
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import { AppDialogProps } from "../AppGlobals";
import { useEffect, useState } from "react";
import { ContentCopy } from "@mui/icons-material";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
	auth,
	db,
	getFirebaseUserId,
	isUserAuthorized,
} from "../database/Firebase";
import { useTranslation } from "react-i18next";

export const ShareDialog: React.FC<AppDialogProps> = ({ isVisible, hide }) => {
	const [isShared, setIsShared] = useState<boolean>(false);
	const [isMouseHovering, setIsMouseHovering] = useState<boolean>(false);
	const [sharedLink, setSharedLink] = useState<string | undefined>();
	const [feedbackLabel, setFeedbackLabel] = useState<string | undefined>();

	const { t } = useTranslation();

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			if (user !== null) {
				const isVisible = await getDocumentsVisibility();
				setIsShared(isVisible);
			}
		});
	}, []);

	useEffect(() => {
		if (isShared) {
			setSharedLink(getSharedLink());
		} else {
			setSharedLink(undefined);
		}
	}, [isShared]);

	const getSharedLink = () =>
		`https://tasks.durigan.jp/?u=${getFirebaseUserId()}`;

	const onSharedChanged = async (
		_event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		setIsShared(checked);
		if (checked) {
			setFeedbackLabel("APP_SHARE_FEEDBACK_ENABLE");
			await updateDocumentsVisibility(true);
			setFeedbackLabel(undefined);
		} else {
			setFeedbackLabel("APP_SHARE_FEEDBACK_UNABLE");
			await updateDocumentsVisibility(false);
			setFeedbackLabel(undefined);
		}
	};

	const onMouseEnter = (
		_event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		setIsMouseHovering(true);
	};

	const onMouseLeave = (
		_event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		setIsMouseHovering(false);
	};

	const copyToClipboard = () => {
		if (!sharedLink) return;
		navigator.clipboard.writeText(sharedLink);
		setFeedbackLabel("APP_SHARE_FEEDBACK_COPIED");
		setTimeout(hideFeedback, 3000);
	};

	const hideFeedback = () => setFeedbackLabel(undefined);

	return (
		<Dialog open={isVisible} onClose={hide} maxWidth="xs" fullWidth>
			<DialogTitle>{t("APP_SHARE_TITLE")}</DialogTitle>
			<DialogContent>
				<FormControlLabel
					control={<Switch checked={isShared} onChange={onSharedChanged} />}
					label={t("APP_SHARE_LABEL_SWITCH")}
					sx={{ mb: 2 }}
				/>
				<Collapse in={feedbackLabel !== undefined}>
					<DialogContentText mb={2}>{t(feedbackLabel!)}</DialogContentText>
				</Collapse>
				<Collapse in={sharedLink !== undefined}>
					<DialogContentText mb={1}>
						{t("APP_SHARE_LABEL_SHARED_LINK")}
					</DialogContentText>
					<Card
						variant="outlined"
						sx={{ mb: 2, borderColor: "blue" }}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
						onClick={copyToClipboard}
					>
						<CardContent>
							<Stack direction="row" alignItems="center">
								<Typography sx={{ wordBreak: "break-all" }}>
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
				</Collapse>
			</DialogContent>
		</Dialog>
	);
};

const getDocument = () => doc(db, "app", getFirebaseUserId());

const getDocumentsVisibility = async (): Promise<boolean> => {
	const document = getDocument();
	try {
		const doc = await getDoc(document);
		if (doc.data() !== undefined) {
			const visible = doc.data()?.visible;
			return visible;
		}
	} catch (err) {
		console.log(err);
	}
	return false;
};

const updateDocumentsVisibility = async (visible: boolean) => {
	if (!isUserAuthorized()) return;

	const document = getDocument();
	const data = { visible };
	try {
		await setDoc(document, data);
		console.log(`Documento atualizado: ${data.toString()}`);
	} catch (err) {
		console.warn("Error saving one on remote");
		console.log(err);
	}
};
