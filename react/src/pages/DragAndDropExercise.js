import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


import Answer from '../components/dnd/answer'

function DndExercise() {
	const [answers, setAnswers] = useState([
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
		let tmp = answers[x]
		answers[x] = answers[y]
		answers[y] = tmp
		console.log("swapping")

		// if i do not waste time copying the array this does not work 🤡
		setAnswers(Array.from(answers))
	}

	let draggableAnswers = []

	answers.forEach((x, i) => {
		draggableAnswers.push(<Answer id={i} text={x} swap={swap} />)
	})

	console.log(draggableAnswers)
	return (
		<DndProvider backend={HTML5Backend}>
			<p>The query you have to make is:</p>
			<p>
				{draggableAnswers.slice(0,2)}
				secrets/
				{draggableAnswers[2]}
			</p>
			<p className='mt-5'>Compose it starting from these blocks:</p>
			<div className="min-w-max grid grid-cols-4 gap-1">
				{draggableAnswers.slice(4)}
			</div>

		</DndProvider>
	)
}

export default DndExercise
