import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Stack,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import {
	User,
	createUserWithEmailAndPassword,
	deleteUser,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase-config";
import { FirebaseError } from "firebase/app";
import { Google } from "@mui/icons-material";

export const AuthDialog: React.FC = () => {
	const [showDialog, setShowDialog] = useState<boolean>(true);
	const [tabValue, setTabValue] = useState<number>(0);
	const [user, setUser] = useState<User | null>(auth.currentUser);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			setUser(user);
		});
		if (auth.currentUser) setShowDialog(false);
	}, []);

	const isLoggedIn = user !== null;

	const userLogout = async () => {
		try {
			await signOut(auth);
		} catch (err) {
			const ferr = err as FirebaseError;
			console.log(ferr.message, ferr.cause, ferr.customData, ferr.code);
		}
	};

	const userDelete = async () => {
		try {
			await deleteUser(user!);
		} catch (err) {
			const ferr = err as FirebaseError;
			console.log(ferr.message, ferr.cause, ferr.customData, ferr.code);
		}
	};

	const continueAsGuest = (): void => {
		setShowDialog(false);
	};

	return (
		<Dialog open={showDialog}>
			<DialogTitle>Autenticação</DialogTitle>
			<DialogContent sx={{ minWidth: 300 }}>
				{!isLoggedIn && (
					<>
						<Tabs
							onChange={(e, v) => setTabValue(v)}
							value={tabValue}
							sx={{ paddingBottom: 1 }}
						>
							<Tab label="Entrar" />
							<Tab label="Criar conta" />
						</Tabs>
						<TabPanel value={tabValue} index={0}>
							<AuthLogin />
						</TabPanel>
						<TabPanel value={tabValue} index={1}>
							<AuthSignup />
						</TabPanel>
						<Button
							onClick={continueAsGuest}
							sx={{ marginTop: 2, marginBottom: 2 }}
						>
							Continuar sem login
						</Button>
					</>
				)}
				{isLoggedIn && (
					<>
						<Stack direction="column" spacing={1}>
							<Typography>{auth.currentUser?.email}</Typography>
							<Button onClick={userLogout} variant="contained">
								Sair
							</Button>
							<Button onClick={userDelete} variant="contained" color="error">
								Deletar conta
							</Button>
						</Stack>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

const AuthLogin: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const submitLogin = async () => {
		try {
			const credentials = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
		} catch (err) {
			const ferr = err as FirebaseError;
			console.log(ferr.message, ferr.cause, ferr.customData, ferr.code);
		}
	};

	const submitLoginWithGoogle = async () => {
		try {
			const credentials = await signInWithPopup(auth, googleProvider);
		} catch (err) {
			const ferr = err as FirebaseError;
			console.log(ferr.message, ferr.cause, ferr.customData, ferr.code);
		}
	};

	return (
		<Box component="form" onSubmit={submitLogin}>
			<TextField
				value={email}
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
				sx={{ paddingBottom: 1 }}
			/>
			<TextField
				type="password"
				value={password}
				placeholder="Senha"
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				sx={{ paddingBottom: 1 }}
			/>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="flex-end"
				spacing={1}
			>
				<Button
					onClick={submitLoginWithGoogle}
					variant="contained"
					startIcon={<Google />}
				>
					Entrar com Google
				</Button>
				<Button onClick={submitLogin} variant="contained">
					Entrar
				</Button>
			</Stack>
		</Box>
	);
};

const AuthSignup: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const submitSignup = async () => {
		try {
			const credentials = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
		} catch (err) {
			const ferr = err as FirebaseError;
			console.log(ferr.message, ferr.cause, ferr.customData, ferr.code);
		}
	};

	return (
		<Box component="form" onSubmit={submitSignup}>
			<TextField
				value={email}
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
				sx={{ paddingBottom: 1 }}
			/>
			<TextField
				type="password"
				value={password}
				placeholder="Senha"
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				sx={{ paddingBottom: 1 }}
			/>
			<Button
				onClick={submitSignup}
				variant="contained"
				sx={{ float: "right" }}
			>
				Criar conta
			</Button>
		</Box>
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
