"use server";
import React from "react";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import ExerciseView from "@/components/exerciseView/view";
import DropdownExercise from "@/components/DropdownExercise/exercise";
import DragAndDropExercise from "@/components/DragAndDropExercise/page";
import DragAndDropMmExercise from "@/components/DragAndDropMultipleMatching/page";
import OpenCloseExercise from "@/components/OpenCloseExercise/page";
import DebugExercise from "@/components/DebugExercise/page";
import MultipleSelection from "@/components/MultipleSelection";

import { getExerciseData } from "@/app/actions";

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
export default async function Exercise({ params }) {
  // Get the current mission
  const missionContent = await getExerciseData(`mission_${params.mission}`);

  let exercise;
  let exerciseArgs;

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
      break;
    case "sd":
      exercise = DropdownExercise;
      exerciseArgs = {
        dropdowns: missionContent.dropdowns,
        explanation: missionContent.explanation,
        name: missionContent.name,
        text: missionContent.text,
      };
      break;
    case "mm":
      exercise = DragAndDropMmExercise;
      exerciseArgs = {
        options: missionContent.solution.toSorted(() => Math.random() - 0.5), // shuffle to obtain options
        solution: missionContent.solution,
        blocks: missionContent.blocks,
      };
      break;
    case "oc":
      exercise = OpenCloseExercise;
      exerciseArgs = {
        blocks: missionContent.blocks,
        solution: missionContent.solution,
      };
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
      break
    case "ms":
      exercise = MultipleSelection;
      exerciseArgs = missionContent;
  }

  /* Placeholder content for exercise explanation */
  const exerciseExplanation = (
    <div
      className="p-4 text-white"
      dangerouslySetInnerHTML={{ __html: missionContent.explanation }}
    ></div>
  );

  /* Placeholder content for exercise link to its chapter page */
  const missionChapter = "/chapter/" + missionContent.difficulty;

  return (
    <div>
      {/* Use the LearningComponent with mission-specific content */}
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
      />
    </div>
  );
}
