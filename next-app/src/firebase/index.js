import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
const db = getFirestore(app);

const auth = getAuth(app.auth());
// const db = firebaseApp.firestore();

// ADD THESE LINES
if (location.hostname === "127.0.0.1") {
  console.log("127.0.0.1 detected!");
  auth.useEmulator("http://127.0.0.1:9099");
  db.useEmulator("127.0.0.1", 8080);
}


export {app,db};