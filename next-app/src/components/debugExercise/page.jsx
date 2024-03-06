"use client"

import { useState } from "react"

export default function DebugExercise({ text, selectables, solution, onScoreComputed }) {
	const [answers, setAnswers] = useState(Array(selectables.length).fill(false))

	function click(i) {
		setAnswers(prev => {
			let arr = Array.from(prev);
			arr[i] = !arr[i];
			return arr;
		})
	}


	// each exercise componet has its function to evaluate the correctness of the answers
	function handleSubmit(e) {
		e.preventDefault()
		let count = 0
		for (let i = 0; i < answers.length; i++) {
			if (answers[i] == solution[i]) {
				count++;
			}
		}
		// here we are calling the onScoreComputed function that was passed as a prop passing the score as an argument.
		// the onScoreComputed function is defined in components/exerciseView/view.jsx (its name is handleCorrectnessComputed)
		onScoreComputed(100 * count / answers.length);
	}

	let i = 0;
	let exercise = [];
	for (const [index, item] of selectables.entries()) {
		// the unselectable string is the text between the last selectable and the current one
		let unselectable = text.substring(i, item[0]);
		// create a button for each selectable string
		let selectable = <button key="selectable_${index}"
			className={answers[index] ? 'bug-selected' : 'bug-selectable'}
			onClick={click.bind(null, index)}>
			{text.substring(item[0], item[1])}
		</button>

		i = item[1];
		exercise.push(unselectable);
		exercise.push(selectable);
	}
	exercise.push(text.substring(i));


	return (
		<>
			<form id='exercise-form' onSubmit={handleSubmit}></form>
			<pre><code>{exercise}</code></pre>
		</>
	)
}
