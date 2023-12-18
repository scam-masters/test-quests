// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx-n-RRkzYIfIJUoKnToix3E8OEfnkkqI",
  authDomain: "test-quests-a3712.firebaseapp.com",
  projectId: "test-quests-a3712",
  storageBucket: "test-quests-a3712.appspot.com",
  messagingSenderId: "249502392786",
  appId: "1:249502392786:web:6086acbbb9986197f5a80b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;