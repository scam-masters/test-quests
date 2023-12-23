"use server";
import React from "react";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import DropdownExercise from "@/components/DropdownExercise/exercise";
import ExerciseView from "@/components/exerciseView/view";

import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/index";

export default async function M2Exercise() {
	/* Placeholder content for exercise explanation */
	const document = (await getDoc(doc(db, "exercises", "mission_2"))).data();
	const exerciseExplanation = (
		<div className="p-4 text-white">
			<h2>Lorem ipsum</h2>
			<br></br>
			<p>
				Todo
			</p>
		</div>
	);

	console.log(document)

	return (
		<ExerciseView
			exerciseExplanation={exerciseExplanation}
			resource='http://example.com/'
			Exercise={DropdownExercise}
			exerciseArguments={{
				dropdowns: document.dropdowns,
				explanation: document.explanation,
				name: document.name,
				points: document.points,
				text: document.text,
			}}
		/>
	)
}
