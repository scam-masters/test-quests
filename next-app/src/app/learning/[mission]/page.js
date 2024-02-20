"use client"
import React, { useState, useEffect } from 'react';
import LearningComponent from '@/components/Learning/learning'

import { getExerciseData } from "@/app/actions"
import Loading from "@/components/Loading";

// Learning Component
// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
export default function Learning({ params }) {
	const [missionContent, setMissionContent] = useState(null)

	// Get the current mission
	useEffect(() => {
		if (!missionContent)
			getExerciseData(`mission_${params.mission}`).then(setMissionContent);
	})

	if (!missionContent)
		return <Loading />

	/* Placeholder content for learning page explanation */
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

