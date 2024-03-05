"use client";
import React from 'react';

function CircleMission({ children, type, userScore, maxPoints, className }) {
	let currentScore = null
	if (userScore >= 0 && maxPoints) {
		currentScore = String(userScore) + '/' + maxPoints;
	}
	return (
		<button className={'min-w-[10%] circle-mission-' + type + ' ' + className}>
			{children}
			{/* if currentScore is not null the part after the && operator will be rendered. */}
			{/* the rendered part will show the user the current score compared to the max points obtainable */}
			{currentScore && <><br /><span>{currentScore}</span></>}
		</button>
	);
};

export default CircleMission;
