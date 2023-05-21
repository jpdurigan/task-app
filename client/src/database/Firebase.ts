// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

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
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
auth.useDeviceLanguage();
export const googleProvider = new GoogleAuthProvider();
