// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from "@firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { persistentLocalCache } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
	apiKey: "AIzaSyA6quvZONMnCFknW69C9YYMDnOmVhlQjVA",
	authDomain: "note-app-377316.firebaseapp.com",
	projectId: "note-app-377316",
	storageBucket: "note-app-377316.appspot.com",
	messagingSenderId: "764137928748",
	appId: "1:764137928748:web:41a261a68857142b6db989",
	measurementId: "G-LS7J5N430J",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
	localCache: persistentLocalCache(),
});
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
auth.useDeviceLanguage();
export const googleProvider = new GoogleAuthProvider();

export const isUserAuthorized = (): boolean => {
	return auth.currentUser !== null;
};

export const getUserFromURL = (): string | null => {
	const searchParams = new URLSearchParams(document.location.search);
	console.log(searchParams, searchParams.get("u"));
	return searchParams.get("u");
};

export const isReadOnly = (): boolean => {
	return !isUserAuthorized() && getUserFromURL() !== null;
};

export const getFirebaseUserId = (): string => {
	if (isUserAuthorized()) return auth.currentUser!.uid;
	if (getUserFromURL()) return getUserFromURL()!;
	return "";
};
