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
		className="w-full h-10 inline-block bg-gray-500"
		> {child}</span>
	)
}


