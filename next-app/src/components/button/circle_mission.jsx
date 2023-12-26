"use client";
import React from 'react';

function CircleMission({ children, type, userScore, maxPoints }) {
	let currentScore = null
	if (userScore >= 0 && maxPoints) {
		currentScore = String(userScore) + '/' + maxPoints;
	}
	return (
		<button className={'circle-mission-' + type}>
			{children}
			{currentScore && <><br /><span>{currentScore}</span></>}
		</button>
	);
};

export default CircleMission;
