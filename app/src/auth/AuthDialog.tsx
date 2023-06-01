import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stack,
	Tab,
	Tabs,
	TextField,
} from "@mui/material";
import {
	createUserWithEmailAndPassword,
	deleteUser,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import React, { useState } from "react";
import { auth, googleProvider } from "../database/Firebase";
import { Google } from "@mui/icons-material";
import { useAuthState } from "react-firebase-hooks/auth";
import { AppDialogProps } from "../AppDialogs";

export const AuthDialog: React.FC<AppDialogProps> = ({ isVisible, hide }) => {
	const [user, loading, error] = useAuthState(auth);
	const [tabValue, setTabValue] = useState<number>(0);

	const userLogout = async () => {
		try {
			await signOut(auth);
		} catch (err) {
			console.log(err);
		}
	};

	const userDelete = async () => {
		try {
			await deleteUser(user!);
		} catch (err) {
			console.log(err);
		}
	};

	const continueAsGuest = (): void => {
		hide();
	};

	return (
		<Dialog open={isVisible} onClose={hide} maxWidth="xs" fullWidth>
			<DialogTitle>Autenticação</DialogTitle>
			<DialogContent>
				{loading && <DialogContentText>Carregando...</DialogContentText>}
				{error && (
					<DialogContentText color="error">
						Um erro ocorreu na Autenticação com o Firebase!
					</DialogContentText>
				)}
				{user !== null ? (
					<DialogContentText>
						Usuário: {auth.currentUser?.email}
					</DialogContentText>
				) : (
					<>
						<Tabs
							onChange={(e, v) => setTabValue(v)}
							value={tabValue}
							sx={{ mb: 2 }}
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
					</>
				)}
			</DialogContent>
			<DialogActions>
				{user !== null ? (
					<>
						<Button onClick={userDelete} color="error">
							Deletar
						</Button>
						<Button onClick={userLogout}>Sair da conta</Button>
					</>
				) : (
					<>
						<Button onClick={continueAsGuest}>Continuar sem login</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
};

const AuthLogin: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

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
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
				sx={{ mb: 1 }}
			/>
			<TextField
				type="password"
				value={password}
				placeholder="Senha"
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				sx={{ mb: 1 }}
			/>
			<Stack direction="row" alignItems="center" spacing={1}>
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
			await createUserWithEmailAndPassword(auth, email, password);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Box component="form" onSubmit={submitSignup}>
			<TextField
				value={email}
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
				fullWidth
				sx={{ mb: 1 }}
			/>
			<TextField
				type="password"
				value={password}
				placeholder="Senha"
				onChange={(e) => setPassword(e.target.value)}
				fullWidth
				sx={{ mb: 1 }}
			/>
			<Button onClick={submitSignup} variant="contained" sx={{ mb: 1 }}>
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
