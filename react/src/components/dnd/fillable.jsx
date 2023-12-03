import React from 'react';
import { useDrop } from 'react-dnd';

export default function Fillable({ child }) {
	const [collectedProps, drop] = useDrop(() => ({
		accept: "answer",
		drop: function(item, monitor) {
			console.log("dropped", item);
		}
	}))

	return (
		<span ref={drop}
			style={{
				width: '10ch',
				height: '1em',
				display: 'inline-block',
				'background-color': 'gray'
			}}
		> {child}</span>
	)
}


