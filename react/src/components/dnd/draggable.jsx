import React from 'react'
import { useDrag } from 'react-dnd'

export default function Draggable({ text, type }) {
	var custom_classes = '';
	switch (type) {
		case 'red':
			custom_classes = 'bg-tq-red hover:bg-tq-red-500';
			break;
		case 'yellow':
			custom_classes = 'bg-tq-yellow hover:bg-tq-yellow-500';
			break;
		case 'green':
			custom_classes = 'bg-tq-green hover:bg-tq-green-500';
			break;
		case 'blue':
			custom_classes = 'bg-tq-accent hover:bg-tq-secondary-500';
			break;
		default:
			custom_classes = 'bg-tq-accent hover:bg-tq-primary-500';
			break;
	}
	custom_classes += ' m-1 cursor-grab text-tq-white w-fit p-2 rounded-sm font-bold transition duration-200 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-md';

	const [{ opacity }, dragRef] = useDrag(
		() => ({
			type: 'answer',
			item: { text },
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1
			})
		}),
		[]
	)
	return (
		<div className={custom_classes} ref={dragRef} style={{ opacity }}>
			{text}
		</div>
	)
}
