import { Box, TextField, Button } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../database/Firebase";
import { useTranslation } from "react-i18next";

export const AuthSignup: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
    const { t } = useTranslation();

	const submitSignup = async () => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Box component="form" onSubmit={submitSignup}>
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
			<Button onClick={submitSignup} variant="contained">
				{t("APP_AUTH_SIGNUP_ACTIONS_SIGNUP")}
			</Button>
		</Box>
	);
};