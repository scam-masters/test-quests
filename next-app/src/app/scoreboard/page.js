"use client"
import React, { useEffect, useState } from 'react';
import ScoreboardComponent from '@/components/scoreboard/scoreboard'

import { getScoreboardData } from "@/app/user_actions"
import Loading from '@/components/loading/loading';

/**
 * Renders the Scoreboard component.
 *
 * @returns {JSX.Element} The rendered Scoreboard component.
 */
export default function Scoreboard() {
	// scoreboardContent returns an array of couples (name, score)
	const [scoreboardContent, setScoreboardContent] = useState(null);
	useEffect(() => {
		if (!scoreboardContent)
			// get all the user to display them in the scoreboard aready ordered
			getScoreboardData().then(setScoreboardContent)
	}, [])
	if (!scoreboardContent)
		return <Loading />

	return (
		<div>
			{/* Use the ScoreboardComponent with data retrieved from backend */}
			<ScoreboardComponent scoreboardData={scoreboardContent} />
		</div>
	);
}
