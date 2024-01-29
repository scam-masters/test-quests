"use server"

import { db, app, auth } from "@/firebase";
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

// Retrieve the list of missions for a certain chapter (so for the difficulty level)
export async function getMissionsByDifficulty(difficultyLevel) {
	let missionList = [];
	try {
		// Create a query to filter documents based on difficulty
		const q = query(collection(db, 'exercises'), where('difficulty', '==', difficultyLevel));

		// Execute the query
		const querySnapshot = await getDocs(q);

		// Iterate through the results and add them to the missionList
		querySnapshot.forEach((doc) => {
			missionList.push({ id: doc.id, data: doc.data() });
		});
	} catch (error) {
		console.log('Error getting missions: ', error);
	}
	return missionList;
}

// Validate email address
const validateEmail = (email) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};

// Register a new user
export async function registerUser(email, password, username) {
	const auth = getAuth(app);
	console.log("Inside the registerUser function --> ", auth);

	// Server-side validation
	if (!email || !password || !username)
		return 'Please fill all the fields.'

	if (!validateEmail(email)) {
		return 'Please enter a valid email address.'
	}

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
	const usersRef = collection(db, "users")

	const docs = await getDocs(query(usersRef, where("score", ">=", 0)))

	const data = []

	// maybe we can get clever with firebase and have it sort and compute last timestamp in the db
	docs.forEach(doc => {
		let timestamp = 0
		let completedCount = 0
		for (let key in doc.data().missions) {
			let missionData = doc.data().missions[key]
			if (missionData.timestamp) {
				timestamp = Math.max(doc.data().missions[key].timestamp, timestamp)
				completedCount += 1
			}
		}

		data.push({
			user: doc.data().username,
			score: doc.data().score,
			timestamp: timestamp,
			completedCount
		})
	})

	data.sort((a, b) => {
		if (a.score == b.score && a.timestamp == b.timestamp)
			return 0
		if (a.score > b.score || (a.score == b.score && a.timestamp < b.timestamp))
			return -1
		return 1
	})
	return data
}

// Example usage:
// const scoreboardData = await getScoreboardData();
// console.log(scoreboardData);

