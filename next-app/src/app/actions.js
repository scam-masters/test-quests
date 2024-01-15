"use server"

import { db, app } from "../firebase/index";
import { doc, getDoc, getDocs, setDoc, query, collection, where, or } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export async function getExerciseData(exerciseName) {
	const docRef = doc(db, "exercises", exerciseName)
	const document = await getDoc(docRef)

	const result = document.data()
	result.id = document.id

	return result
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
			score: -1,
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

// Retrieve scoreboard data (mock for testing)
export async function getScoreboardData() {
	// Mock data for testing purposes
	const mockData = [
	  { user: 'User1', score: "100" },
	  { user: 'User2', score: "85" },
	  { user: 'User3', score: "70" },
	  { user: 'User4', score: "50" },
	  { user: 'User5', score: "30" },
	];
  
	// Simulate asynchronous behavior with a delay (you can remove this in a real implementation)
	await new Promise(resolve => setTimeout(resolve, 1000));
  
	return mockData;
  }
  
  // Example usage:
  // const scoreboardData = await getScoreboardData();
  // console.log(scoreboardData);
  