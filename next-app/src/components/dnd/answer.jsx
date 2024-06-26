import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

// Answer is a component that represents an answer block in the drag and drop exercise
export default function Answer({ id, text, swap, type }) {
	/*
	id is a unique identifier for each answer block, text is the content of the answer block,
	swap is a function to handle the swapping of answer blocks when one is dropped onto another,
	and type is used to determine the color of the answer block (the default is test-quests-blue).
	*/
	const ref = useRef(null)
	const commonClasses = ' rounded-sm font-bold m-1 text-tq-white w-fit p-2 '
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
	custom_classes += commonClasses + ' cursor-grab transition duration-200 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95 active:shadow-md ';

	// useDrag is a hook from the react-dnd library that allows the answer block to be draggable.
	// the swap function is called when the answer block is dropped onto another. Its implememntation is inside
	// components/dragAndDropExercise/page.js (basically it swaps the text of the two answer blocks).
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
			},
			canDrag: (_monitor) => {
				return text !== null
			}
		}),
		[text]
	)

	// useDrop is a hook from the react-dnd library that allows the answer block to be a drop target
	const [, drop] = useDrop(() => ({
		accept: "answer",
		drop: function() {
			return { id }
		}
	}))

	// const classesEmpty = commonClasses + ' m-1 bg-gray-500  w-24 inline-block m-1 bg-gray-500 active:scale-95 '
	const classesEmpty = 'bg-gray-500 ' + commonClasses

	if (text === null) {
		// TODO: differentiate style of empty block
		return (
			<span className={classesEmpty} ref={drop(ref)} style={{ opacity }}>___</span>
		)
	} else {
		return (
			<span className={custom_classes} ref={drag(drop(ref))} style={{ opacity }}>
				{text}
			</span>
		)
	}

}
