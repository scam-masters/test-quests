import { initializeApp } from "firebase/app";
import { initializeAuth, connectAuthEmulator, getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, initializeFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAx-n-RRkzYIfIJUoKnToix3E8OEfnkkqI",
  authDomain: "test-quests-a3712.firebaseapp.com",
  projectId: "test-quests-a3712",
  storageBucket: "test-quests-a3712.appspot.com",
  messagingSenderId: "249502392786",
  appId: "1:249502392786:web:6086acbbb9986197f5a80b"
};

// Initialize Firebase: https://firebase.google.com/docs/firestore/quickstart
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// check if we are on the development to use the correct emulators
if (process.env.NODE_ENV === "development") {
	connectAuthEmulator(auth, "http://127.0.0.1:9099");
	connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

// console.log("You are using the current auth", auth);
// console.log("You are using the current db", db);

export {app,db,auth};