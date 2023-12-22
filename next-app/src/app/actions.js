"use server"

import { db, app } from "../firebase/index";
import { doc, getDoc, getDocs, setDoc, query, collection, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


export async function getExerciseData(exerciseName) {
	const docRef = doc(db, "exercises", exerciseName);
	const document = await getDoc(docRef);

	return document.data()
}

export async function registerUser(email, password, username) {
	const auth = getAuth(app);

	if (!email || !password || !username)
		return 'Please fill all the fields.'

	if (password.length < 6)
		return 'Password is too short. It must contain at least 6 characters.'

	try {
		const querySnapshot = await getDocs(query(collection(db, "users"), where("username", "==", username)));
		if (querySnapshot.empty) {
			await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await setDoc(doc(db, "users", email), {
				username: username,
				score: 0,
				missions: {
					mission_1: { id: "mission_1", score: 0 },
					mission_2: { id: "mission_2", score: -1 }
				}
			});
		} else {
			console.error("how this happened??")
		}
	} catch (error) {
		switch (error.code) {
			case "auth/email-already-in-use":
				return "An account is already associated with this email or this username";
			default:
				console.error(error)
		}
	}
	return null
}
