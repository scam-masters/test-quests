"use client";
import React from 'react';

function CircleMission({ children, type, userScore, maxPoints, className }) {
	let currentScore = null
	if (userScore >= 0 && maxPoints) {
		currentScore = String(userScore) + '/' + maxPoints;
	}
	return (
		<button className={'circle-mission-' + type + ' ' + className}>
			{children}
			{currentScore && <><br /><span>{currentScore}</span></>}
		</button>
	);
};

export default CircleMission;
