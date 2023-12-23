"use server"

import { db, app } from "../firebase/index";
import { doc, getDoc, getDocs, setDoc, query, collection, where, or } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export async function getExerciseData(exerciseName) {
	const docRef = doc(db, "exercises", exerciseName)
	const document = await getDoc(docRef)

	return document.data()
}

// Retrieve the list of missions from the database to initialize the user progress
export async function getMissionList() {
	let missionList = []
	try {
		const querySnapshot = await getDocs(collection(db, "exercises"));
		querySnapshot.forEach((doc) => {
			missionList.push({ id: doc.id, data: doc.data() });
		});
	} catch (error) {
		console.log("Error getting missions: ", error);
	}
	return missionList;
}

// Register a new user
export async function registerUser(email, password, username) {
	const auth = getAuth(app);

	// Server-side validation
	if (!email || !password || !username)
		return 'Please fill all the fields.'

	if (password.length < 6)
		return 'Password is too short. It must contain at least 6 characters.'

	try {
		// Check if username is already taken. If so, throw an error
		const querySnapshot = await getDocs(query(collection(db, "users"), where("username", "==", username)))
		if (!querySnapshot.empty) {
			throw new Error("Username already taken")
		}

		// If username is not taken, create the user account in Firebase Authentication
		// Throws an error if the email is already used
		await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		// Create user document in Firestore database
		setDoc(doc(db, "users", email), {
			username: username,
			score: 0,
			missions: { mission_1: { id: "mission_1", score: 0 } }
		});

	} catch (error) {
		switch (error.message) {
			case "Firebase: Error (auth/email-already-in-use).":
			case "Username already taken":
				return "An account is already associated with this email or this username"
			default:
				console.log(error.message)
				return "An error occured while creating your account. Please try again."
		}
	}
	return null
}
