import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


import Answer from '../components/dnd/answer'

function DndExercise() {
	const [answers, setAnswers] = useState([
		null,
		null,
		null,
		null,
		"?",
		"../",
		"flag.txt",
		"file=",
		"../",
		"files.php",
		"server/"
	])

	function swap(x, y) {
		setAnswers(prev => {
			let a = Array.from(prev)
			let tmp = a[x]
			a[x] = a[y]
			a[y] = tmp
			console.log("swapping")

			return a
		})
	}

	let draggableAnswers = []

	answers.forEach((x, i) => {
		draggableAnswers.push(<Answer key={i} id={i} text={x} swap={swap} />)
	})

	return (
		<DndProvider backend={HTML5Backend}>
			<p>The query you have to make is:</p>
			<p>
				{draggableAnswers.slice(0, 3)}
				secrets/
				{draggableAnswers[3]}
			</p>
			<p className='mt-5'>Compose it starting from these blocks:</p>
			<div className="min-w-max grid grid-cols-4 gap-1">
				{draggableAnswers.slice(4)}
			</div>

		</DndProvider>
	)
}

export default DndExercise
