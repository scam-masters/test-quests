'use server'; // compute the function on server side (as the function is async)
import React from "react";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import DragAndDropExercise from "@/components/DragAndDropExercise/page";
import ExerciseView from "@/components/exerciseView/view"

/* Firestore Data Retrivial */
import { db } from "../../firebase/index";
import { collection, getDocs } from "firebase/firestore"; 


async function M1Exercise() {
	/* 
		getData is a function that retrieves dnd mission data 
		it takes as input the document id (e.g. "mission_1") 
		and returns an object with, as fields, the data of the mission
		
		Explanation: explanation in html
		Blocks: blocks showed to the user, either to be filled ("") or hinted to user (whatever else) 
		Options: blocks available to the user 
		Solutions: correct order of options

		Example:	 getDataDnD("mission_1")
	*/
	let exercisesData = null;
	try {
		const querySnapshot = await getDocs(collection(db, "exercises"));

		const filteredDocs = querySnapshot.docs.filter((doc) => doc.id === "mission_1");

		if (filteredDocs.length === 1) {
			exercisesData = {
				explanation: filteredDocs[0].data().explanation,
				blocks: filteredDocs[0].data().blocks,
				solution: filteredDocs[0].data().solution,
				options: filteredDocs[0].data().solution.sort(() => Math.random() - 0.5) // shuffle to obtain options
			};
		} else {
			console.error("Document not found or multiple documents found.");
			return null;
		}
	} catch (error) {
		console.error("Error getting data: ", error);
		throw error;
	}

	/* Placeholder content for exercise explanation */
	const exerciseExplanation = (
		<div className="p-4 text-white" dangerouslySetInnerHTML={{__html: exercisesData.explanation}}>
		</div>
	);

	return (
		<ExerciseView
			exerciseExplanation={exerciseExplanation}
			resource='https://owasp.org/www-community/attacks/Path_Traversal'
			Exercise={DragAndDropExercise}
			exerciseArguments={{
				input: exercisesData.blocks,
				data: exercisesData.options,
				solution: exercisesData.solution
			}}
		/>
	)
}

export default M1Exercise;
