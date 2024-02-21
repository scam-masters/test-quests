"use client";
import React, { useEffect, useState } from "react";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import ExerciseView from "@/components/exerciseView/view";
import DropdownExercise from "@/components/DropdownExercise/exercise";
import DragAndDropExercise from "@/components/DragAndDropExercise/page";
import DragAndDropMmExercise from "@/components/DragAndDropMultipleMatching/page";
import OpenCloseExercise from "@/components/OpenCloseExercise/page";
import DebugExercise from "@/components/DebugExercise/page";
import MultipleSelection from "@/components/MultipleSelection";

import { getExerciseData } from "@/app/actions";
import Loading from "@/components/Loading";

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
export default function Exercise({ params }) {
	// Get the current mission
	const [missionContent, setMissionContent] = useState(null)
	useEffect(() => {
		if (!missionContent)
			getExerciseData(`mission_${params.mission}`).then(setMissionContent)
	})

	if (!missionContent)
		return <Loading />

	let exercise;
	let exerciseArgs;
	let hint;

	switch (missionContent.type) {
		case "dnd":
			exercise = DragAndDropExercise;
			exerciseArgs = {
				explanation: missionContent.explanation,
				blocks: missionContent.blocks,
				solution: missionContent.solution,
				options: (missionContent.options || missionContent.solution).toSorted(
					() => Math.random() - 0.5
				), // shuffle to obtain options
			};
			hint = "Drag and drop the blue blocks to fill all the blanks."
			break;
		case "sd":
			exercise = DropdownExercise;
			exerciseArgs = {
				dropdowns: missionContent.dropdowns,
				explanation: missionContent.explanation,
				name: missionContent.name,
				text: missionContent.text,
			};
			hint = "Select the correct option from the dropdowns to fill all the blanks."
			break;
		case "mm":
			exercise = DragAndDropMmExercise;
			exerciseArgs = {
				options: missionContent.solution.toSorted(() => Math.random() - 0.5), // shuffle to obtain options
				solution: missionContent.solution,
				blocks: missionContent.blocks,
			};
			hint = "Reorder the blue blocks to match the statements on the left."
			break;
		case "oc":
			exercise = OpenCloseExercise;
			exerciseArgs = {
				blocks: missionContent.blocks,
				solution: missionContent.solution,
			};
			hint = "Write your answers in the empty spaces."
			break;
		case "debug":
			exercise = DebugExercise;
			exerciseArgs = {
				text: missionContent.text,
				selectables: missionContent.selectables.map((selectable) => {
					return selectable.split("-").map((s) => parseInt(s));
				}),
				solution: missionContent.solution,
			};
			hint = "Select the buggy statements to fix the code."
			break
		case "ms":
			exercise = MultipleSelection;
			exerciseArgs = missionContent;
			hint = "Select all the correct answers among the options."
	}

	/* Placeholder content for exercise explanation */
	const exerciseExplanation = (
		<div
			className="p-4 text-white"
			dangerouslySetInnerHTML={{ __html: missionContent.explanation }}
		></div>
	);

	/* Placeholder content for exercise link to its chapter page */
	const missionChapter = "/storyline/" + missionContent.storyline + "/chapter/" + missionContent.difficulty;

	/* Use the LearningComponent with mission-specific content */
	return (
		<ExerciseView
			missionId={missionContent.id}
			missionChapter={missionChapter}
			exerciseExplanation={exerciseExplanation}
			resource={missionContent.resourceLink}
			Exercise={exercise}
			exerciseArguments={exerciseArgs}
			exercisePoints={missionContent.points}
			exerciseThreshold={missionContent.threshold}
			time={missionContent.time}
			hint={hint}
		/>
	);
}
