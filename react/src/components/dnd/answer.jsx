import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

export default function Answer({ id, text, swap, type }) {
	const ref = useRef(null)
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

	const [{ opacity }, drag] = useDrag(
		() => ({
			type: 'answer',
			item: { id },
			collect: (monitor) => ({
				opacity: monitor.isDragging() ? 0.5 : 1
			}),
			end: (_item, monitor) => {
				if (monitor.didDrop()) {
					swap(id, monitor.getDropResult().id)
				}
			}
		}),
		[]
	)

	const [collectedProps, drop] = useDrop(() => ({
		accept: "answer",
		drop: function() {
			return { id }
		}
	}))

	return (
		<span className={custom_classes} ref={drag(drop(ref))} style={{ opacity, minWidth: '6ch', minHeight: '3em' }}>
			{text}
		</span>
	)
}
