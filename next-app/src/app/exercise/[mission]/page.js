"use server"
import React from 'react';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import ExerciseView from '@/components/ExerciseView/view'
import DropdownExercise from '@/components/DropdownExercise/exercise'
import DragAndDropExercise from '@/components/DragAndDropExercise/page'

import { getExerciseData } from "@/app/actions"

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
export default async function Exercise({ params }) {
    // Get the current mission
    const missionContent = await getExerciseData(`mission_${params.mission}`);

    let exercise;
    let exerciseArgs;

    switch (missionContent.type) {
        case 'dnd':
            exercise = DragAndDropExercise
            exerciseArgs = {
                explanation: missionContent.explanation,
                blocks: missionContent.blocks,
                solution: missionContent.solution,
                options: missionContent.solution.toSorted(() => Math.random() - 0.5), // shuffle to obtain options
                points: missionContent.points
            }
            break;
        case 'sd':
            exercise = DropdownExercise
            exerciseArgs = {
                dropdowns: missionContent.dropdowns,
                explanation: missionContent.explanation,
                name: missionContent.name,
                points: missionContent.points,
                text: missionContent.text,
            }
            break;
    }

    /* Placeholder content for exercise explanation */
    const exerciseExplanation = (
        <div className="p-4 text-white" dangerouslySetInnerHTML={{ __html: missionContent.explanation }}>
        </div>
    );

    return (
        <div>
            {/* Use the LearningComponent with mission-specific content */}
            <ExerciseView
                missionId={missionContent.id}
                exerciseExplanation={exerciseExplanation}
                resource={missionContent.resourceLink}
                Exercise={exercise}
                exerciseArguments={exerciseArgs}
            />
        </div>
    );
}
