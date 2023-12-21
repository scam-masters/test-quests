"use server"
import React from 'react';
import LearningComponent from '@/components/Learning/learning'

import { getExerciseData } from "@/app/actions"

// M1Learning Component
async function M1Learning() {
	// Get the content for Mission 1
	const missionContent = await getExerciseData("mission_1");

	return (
		<div>
			{/* Use the LearningComponent with mission-specific content */}
			<LearningComponent {...missionContent.learning} />
		</div>
	);
}

export default M1Learning;
