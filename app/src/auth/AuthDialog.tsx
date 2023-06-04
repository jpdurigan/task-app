import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	Radio,
	RadioGroup,
	Stack,
	Tab,
	Tabs,
} from "@mui/material";
import { User, deleteUser, signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../database/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { AppDialogProps } from "../AppGlobals";
import { FirebaseError } from "firebase/app";
import { useTranslation } from "react-i18next";
import { AuthSignup } from "./AuthSignup";
import { AuthLogin } from "./AuthLogin";
import i18next from "i18next";

interface AuthDialogProps extends AppDialogProps {
	deleteAll: () => Promise<unknown>;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({
	isVisible,
	hide,
	deleteAll,
}) => {
	const [user, loading, error] = useAuthState(auth, {
		onUserChanged: async (_user: User | null) => {
			setFeedbackLabel("");
		},
	});
	const [tabValue, setTabValue] = useState<number>(0);
	const [feedbackLabel, setFeedbackLabel] = useState<string | undefined>();
	const { t } = useTranslation();

	const userLogout = async () => {
		try {
			await signOut(auth);
		} catch (err) {
			console.log(err);
		}
	};

	const userDelete = async () => {
		if (!user) return;

		try {
			setFeedbackLabel("APP_AUTH_FEEDBACK_DELETING_DOCS");
			await deleteAll();
			setFeedbackLabel("APP_AUTH_FEEDBACK_DELETING_USER");
			await deleteUser(user);
		} catch (err) {
			console.log(err);
			const errFirebase = err as FirebaseError;
			if (errFirebase.code === "auth/requires-recent-login") {
				setFeedbackLabel("APP_AUTH_FEEDBACK_ERROR_RECENT_LOGIN");
			} else {
				setFeedbackLabel("APP_AUTH_FEEDBACK_ERROR_GENERIC");
			}
		}
	};

	const continueAsGuest = (): void => {
		hide();
	};

	const handleLanguageChange = (
		_event: React.ChangeEvent<HTMLInputElement>,
		value: string
	) => {
		i18next.changeLanguage(value);
	};

	return (
		<Dialog open={isVisible} onClose={hide} maxWidth="xs" fullWidth>
			<DialogTitle>{t("APP_AUTH_TITLE")}</DialogTitle>
			<DialogContent>
				{feedbackLabel && (
					<DialogContentText mb={2}>{t(feedbackLabel)}</DialogContentText>
				)}
				{loading && (
					<DialogContentText mb={2}>
						{t("APP_AUTH_FEEDBACK_LOADING")}
					</DialogContentText>
				)}
				{error && (
					<DialogContentText color="error" mb={2}>
						{t("APP_AUTH_FEEDBACK_ERROR_AUTH")}
					</DialogContentText>
				)}
				<Box mb={2}>
					{user !== null ? (
						<>
							<DialogContentText>
								{t("APP_AUTH_USER")}: {auth.currentUser?.email}
							</DialogContentText>
						</>
					) : (
						<>
							<Tabs
								onChange={(_e, v) => setTabValue(v)}
								value={tabValue}
								sx={{ mb: 2 }}
							>
								<Tab label={t("APP_AUTH_TABS_LOGIN")} />
								<Tab label={t("APP_AUTH_TABS_SIGNUP")} />
							</Tabs>
							<TabPanel value={tabValue} index={0}>
								<AuthLogin />
							</TabPanel>
							<TabPanel value={tabValue} index={1}>
								<AuthSignup />
							</TabPanel>
						</>
					)}
				</Box>
				<Box mb={2}>
					<Stack direction="row" gap={2}>
						<DialogContentText width="50%">
							{t("APP_AUTH_LABEL_LANGUAGE")}
						</DialogContentText>
						<RadioGroup
							value={i18next.language}
							onChange={handleLanguageChange}
						>
							<FormControlLabel
								value="pt"
								control={<Radio sx={{ p: 0.5 }} />}
								label="Português"
							/>
							<FormControlLabel
								value="en"
								control={<Radio sx={{ p: 0.5 }} />}
								label="English"
							/>
						</RadioGroup>
					</Stack>
				</Box>
			</DialogContent>
			<DialogActions>
				{user !== null ? (
					<>
						<Button onClick={userDelete} color="error">
							{t("APP_AUTH_ACTIONS_DELETE")}
						</Button>
						<Button onClick={userLogout}>{t("APP_AUTH_ACTIONS_LOGOUT")}</Button>
					</>
				) : (
					<>
						<Button onClick={continueAsGuest}>
							{t("APP_AUTH_ACTIONS_GUEST")}
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
};

interface TabPanelProps {
	index: number;
	value: number;
	children?: React.ReactNode;
}
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
	return <>{value === index && children}</>;
};
