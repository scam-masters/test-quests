"use client";
import React, { useEffect, useState } from "react";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import ExerciseView from "@/components/exerciseView/view";
import DropdownExercise from "@/components/dropdownExercise/exercise";
import DragAndDropExercise from "@/components/dragAndDropExercise/page";
import DragAndDropMmExercise from "@/components/dragAndDropMultipleMatching/page";
import OpenCloseExercise from "@/components/openCloseExercise/page";
import DebugExercise from "@/components/debugExercise/page";
import MultipleSelection from "@/components/multipleSelection/multipleSelection";

import { getExerciseData } from "@/app/actions";
import Loading from "@/components/loading/loading";

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
/**
 * Represents an exercise component.
 *
 * @param {Object} props - The props for the Exercise component.
 * @param {Object} props.params - The parameters for the exercise.
 * @returns {JSX.Element} The Exercise component.
 */
export default function Exercise({ params }) {
	// Get the current mission
	const [missionContent, setMissionContent] = useState(null);
	const [embed, setEmbed] = useState(false);

	useEffect(() => {
		if (!missionContent) {
			getExerciseData(`mission_${params.mission}`).then((result) => {
				setMissionContent(result);
				setEmbed(result.embedding ? true : false);
			});
		}
	}); // Add missionContent and params.mission as dependencies

	if (!missionContent) {
		return <Loading />;
	}

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
				// take the options or the solution (based on their presence) and shuffle them
				options: (missionContent.options || missionContent.solution).toSorted(
					() => Math.random() - 0.5
				), // shuffle to obtain options
			};
			hint = "Drag and drop the blue blocks to fill all the blanks.";
			break;
		case "sd":
			exercise = DropdownExercise;
			exerciseArgs = {
				dropdowns: missionContent.dropdowns,
				explanation: missionContent.explanation,
				name: missionContent.name,
				text: missionContent.text,
			};
			hint = "Select the correct option from the dropdowns to fill all the blanks.";
			break;
		case "mm":
			exercise = DragAndDropMmExercise;
			exerciseArgs = {
				options: missionContent.solution.toSorted(() => Math.random() - 0.5), // shuffle to obtain options
				solution: missionContent.solution,
				blocks: missionContent.blocks,
			};
			hint = "Reorder the blue blocks to match the statements on the left.";
			break;
		case "oc":
			exercise = OpenCloseExercise;
			exerciseArgs = {
				blocks: missionContent.blocks,
				solution: missionContent.solution,
			};
			hint = "Write your answers in the empty spaces.";
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
			hint = "Select the buggy statements to fix the code.";
			break;
		case "ms":
			exercise = MultipleSelection;
			exerciseArgs = {
				text: missionContent.text,
				questions: missionContent.questions,
			}
			hint = "Select all the correct answers among the options.";
	}

	/* Placeholder content for exercise link to its chapter page */
	const missionChapter = "/storyline/" + missionContent.storyline + "/chapter/" + missionContent.difficulty;

	/* Placeholder content for exercise explanation */
	const exerciseExplanation = (
		<>
			{embed ? (
				<>
					<div
						className="p-4 text-white"
						dangerouslySetInnerHTML={{ __html: missionContent.explanation }}
					></div>
					<iframe
						className="w-full h-full p-2"
						// take the page to embed (as a link) from the mission content retreived from the db 
						src={missionContent.embedding}
						title="Embed"
					></iframe>
				</>
			) : (
				<div
					className="p-4 text-white"
					dangerouslySetInnerHTML={{ __html: missionContent.explanation }}
				></div>
			)}
		</>
	);

	/* Use the LearningComponent with mission-specific content */
	return (
		<ExerciseView
			missionId={missionContent.id}
			missionChapter={missionChapter}
			exerciseExplanation={exerciseExplanation}
			resource={missionContent.learning.resourceLink}
			Exercise={exercise}
			exerciseArguments={exerciseArgs}
			exercisePoints={missionContent.points}
			exerciseThreshold={missionContent.threshold}
			time={missionContent.time}
			hint={hint}
		/>
	);
}
