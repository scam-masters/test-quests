"use client";
import React from "react";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import DropdownExercise from "@/components/DropdownExercise/exercise";
import ExerciseView from "@/components/exerciseView/view";

export default function M2Exercise() {
	/* Placeholder content for exercise explanation */
	const exerciseExplanation = (
		<div className="p-4 text-white">
			<h2>Lorem ipsum</h2>
			<br></br>
			<p>
				Todo
			</p>
		</div>
	);

	return (
		<ExerciseView
			exerciseExplanation={exerciseExplanation}
			resource='http://example.com/'
			Exercise={DropdownExercise}
		/>
	)
}
