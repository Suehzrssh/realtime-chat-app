import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCIhAfF8XQohU4t0r6p0bx3eXpPLNIGTuE",
  authDomain: "react-chat-app-5c395.firebaseapp.com",
  projectId: "react-chat-app-5c395",
  storageBucket: "react-chat-app-5c395.appspot.com",
  messagingSenderId: "115921276441",
  appId: "1:115921276441:web:38d4ef6512e5ac3a9fe488"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);