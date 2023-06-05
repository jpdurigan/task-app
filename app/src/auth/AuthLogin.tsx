import { Google } from "@mui/icons-material";
import { Box, TextField, Stack, Button } from "@mui/material";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth, googleProvider } from "../database/Firebase";
import { useTranslation } from "react-i18next";

export const AuthLogin: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { t } = useTranslation();

	const submitLogin = async () => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (err) {
			console.log(err);
		}
	};

	const submitLoginWithGoogle = async () => {
		try {
			await signInWithPopup(auth, googleProvider);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Box component="form" onSubmit={submitLogin}>
			<TextField
				value={email}
				placeholder={t("APP_AUTH_EMAIL_PLACEHOLDER") as string}
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
				sx={{ mb: 1 }}
			/>
			<TextField
				type="password"
				value={password}
				placeholder={t("APP_AUTH_PASSWORD_PLACEHOLDER") as string}
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				sx={{ mb: 1 }}
			/>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Button onClick={submitLogin} variant="contained">
					{t("APP_AUTH_LOGIN_ACTIONS_LOGIN")}
				</Button>
				<Button
					onClick={submitLoginWithGoogle}
					variant="contained"
					startIcon={<Google />}
				>
					{t("APP_AUTH_LOGIN_ACTIONS_LOGIN_GOOGLE")}
				</Button>
			</Stack>
		</Box>
	);
};
