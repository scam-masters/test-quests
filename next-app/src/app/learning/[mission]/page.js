"use client"
import React, { useState, useEffect } from 'react';
import LearningComponent from '@/components/learning/learning'

import { getExerciseData } from "@/app/actions"
import Loading from "@/components/loading/loading";

// Learning Component
// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
/**
 * Renders the Learning component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters for the current mission.
 * @returns {JSX.Element} The rendered Learning component.
 */
export default function Learning({ params }) {
	const [missionContent, setMissionContent] = useState(null)

	// Get the current mission
	useEffect(() => {
		if (!missionContent)
			getExerciseData(`mission_${params.mission}`).then(setMissionContent);
	})

	if (!missionContent)
		return <Loading />

	// html content for the learning component to be passsed to the LearningComponent
	const learningContent = (
		<div className="p-4 text-white" dangerouslySetInnerHTML={{ __html: missionContent.learning.content }}>
		</div>
	);
	missionContent.learning.chapterLink = "/chapter/" + missionContent.difficulty;
	missionContent.learning.contentHTML = learningContent;

	console.log(missionContent)
	return (
		<div>
			{/* Use the LearningComponent with mission-specific content */}
			<LearningComponent {...missionContent.learning} storyline={missionContent.storyline} />
		</div>
	);
}

