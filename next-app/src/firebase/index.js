import { initializeApp } from "firebase/app";
import { initializeAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

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
const auth = initializeAuth(app);
const db = getFirestore(app);
// const db = firebaseApp.firestore();

// check if we are on the development to use the correct emulators
//if (location.hostname === "127.0.0.1") { //location is not recognized
if(typeof window !== 'undefined' && window.location.hostname === "127.0.0.1"){
  console.log("127.0.0.1 detected! --> ", window.location.hostname  );
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, "http://127.0.0.1:8080");
}

console.log("You are using the current auth", auth);
console.log("You are using the current db", db);

export {app,db,auth};