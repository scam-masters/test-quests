"use client";
import React from 'react';

function CircleMission({ children, type, userScore, maxPoints }){
	let currentScore = String(userScore).concat(String('/')).concat(String(maxPoints));
	currentScore = maxPoints ? currentScore : null;
	return (
		<button className={'circle-mission-' + type}>
			{children}
			{currentScore && <><br /><span>{currentScore}</span></>}
		</button>
	);
};

export default CircleMission;
