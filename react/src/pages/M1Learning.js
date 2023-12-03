import React from 'react';
import Button from '../components/button/button';

function M1Learning({ switchPage }) {
	return (
		<>
			<Button onClick={() => switchPage('landing')} type="blue">Go back to main page</Button>
			<Button onClick={() => switchPage('exercise')} type="blue">Go to the exercise page</Button>
		</>
	);
}

export default M1Learning;
