"use server"
import React from 'react';
import LearningComponent from '@/components/Learning/learning'

import { getExerciseData } from "@/app/actions"

// Learning Component
// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
export default async function Learning({ params }) {
	// Get the current mission
	const missionContent = await getExerciseData(`mission_${params.mission}`);

	/* Placeholder content for learning page explanation */
	const learningContent = (
		<div className="p-4 text-white" dangerouslySetInnerHTML={{ __html: missionContent.learning.content }}>
		</div>
	);
	missionContent.learning.contentHTML = learningContent;
	
	return (
		<div>
			{/* Use the LearningComponent with mission-specific content */}
			<LearningComponent {...missionContent.learning} />
		</div>
	);
}

