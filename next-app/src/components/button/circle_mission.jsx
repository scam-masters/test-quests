import React from 'react';

const CircleMission = ({ children, type }) => {
	return (
		<button className={'circle-mission-' + type}>
			{children}
		</button>
	);
};

export default CircleMission;
