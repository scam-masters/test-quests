"use client"

import { db, app } from "../firebase/index";
import { doc, getDoc, getDocs, setDoc, query, collection, where, or } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getUserData, setUserData } from "./user_actions";

export async function getProfileData(username) {
	const usersRef = collection(db, "users")
	const docs = await getDocs(query(usersRef, where("username", "==", username)))

	if (docs.empty) {
		return null
	}
	let document = docs.docs[0] // username is unique

	const result = document.data()
	result.email = document.id

	return result
}

export async function getExerciseData(exerciseName) {
	const docRef = doc(db, "exercises", exerciseName)
	const document = await getDoc(docRef)

	const result = document.data()
	result.id = document.id

	return result
}

export async function getStorylineList() {
	let storylineList = []
	try {
		const querySnapshot = await getDocs(collection(db, "exercises"));
		querySnapshot.forEach((doc) => {
			if (!storylineList.includes(doc.data().storyline)) {
				storylineList.push(doc.data().storyline)
			}
		});
	} catch (error) {
		console.log("Error getting storylines: ", error);
	}
	return storylineList;
}
// Retrieve the list of missions from the database to initialize the user progress
export async function getMissionList(language) {
	let missionList = []
	try {
		const querySnapshot = await getDocs(collection(db, "exercises"));
		querySnapshot.forEach((doc) => {
			if (doc.data().storyline == language) {
				missionList.push({ id: doc.id, data: doc.data() });
			}
		});
	} catch (error) {
		console.log("Error getting missions: ", error);
	}
	return missionList;
}

// Retrieve the list of missions for a certain chapter (so for the difficulty level) that belongs to a certain storyline
export async function getChapterMissions(difficultyLevel, storyline) {
	let missionList = [];
	try {
		// Create a query to filter documents based on difficulty
		const q = query(
			collection(db, 'exercises'),
			where('difficulty', '==', difficultyLevel),
			where('storyline', '==', storyline)
		);

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

export async function getMIssionById(mission_id) {
	const docRef = doc(db, "exercises", mission_id);
	const document = await getDoc(docRef);
	const result = document.data();
	result.id = document.id;
	return result;
}

// Retrieve the list of missions for a certain chapter (so for the difficulty level)
export async function getStorylineMissions(storyline) {
	let missionList = [];
	try {
		// Create a query to filter documents based on difficulty
		const q = query(
			collection(db, 'exercises'),
			where('storyline', '==', storyline)
		);

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

// check if the user have finished the storyline
export async function checkStorylineCompletion(mission_id) {

	const missionData = await getMIssionById(mission_id);
	//const difficulty = missionData.difficulty;
	const storyline = missionData.storyline;
	// i should get all the mission for a storyline not for a difficulty
	const missions = await getStorylineMissions(storyline);

	// if the mission is the last mission of the storyline thank return true
	const lastMission = missions.reduce((prevMission, currentMission) => {
		const prevMissionId = parseInt(prevMission.id.split('_')[1]);
		const currentMissionId = parseInt(currentMission.id.split('_')[1]);
		return currentMissionId > prevMissionId ? currentMission : prevMission;
	});
	console.log("Last mission ", lastMission.id);
	console.log(mission_id);
	if (lastMission.id === mission_id) {
		console.log("storyline completed");
		// check that the user doesn't have this badge already
		const userData = await getUserData()
		if (!userData.badges.includes(`storyline_completion_${storyline}`)) {
			userData.badges.push(`storyline_completion_${storyline}`)
			setUserData(userData)
		}
		return true;
	}
	return false;
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

		// Select the first mission of each storyline
		const storylines = await getStorylineList();
		const missions = new Map();
		for (const storyline of storylines) {
			const missionList = await getStorylineMissions(storyline);
			missions.set(missionList[0].id, { id: missionList[0].id, score: 0 });
		}

		console.log(missions);

		// Create user document in Firestore database
		setDoc(doc(db, "users", email), {
			username: username,
			score: -1,
			missions: { ...Object.fromEntries(missions) },
			avatar: 0,
			badges: [],
			friends: [],
			friend_requests: []
		});

		// If username is not taken, create the user account in Firebase Authentication
		// Throws an error if the email is already used
		await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
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

// Example usage:
// const scoreboardData = await getScoreboardData();
// console.log(scoreboardData);

