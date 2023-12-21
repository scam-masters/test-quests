"use server"

import { db } from "../firebase/index";
import { doc, getDoc } from "firebase/firestore";


export async function getExerciseData(exerciseName) {
	const docRef = doc(db, "dnd_exercises", exerciseName);
	const document = await getDoc(docRef);

	return document.data()
}
