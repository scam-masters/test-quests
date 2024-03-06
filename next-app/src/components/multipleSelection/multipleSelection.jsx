"use client"

import { useState } from "react"

export default function MultipleSelection({ text, questions, onScoreComputed }) {
	// the setAnswers function is called with a function as its argument.
	// This function receives the previous state (prevState) and returns the new state.
	const [answers, setAnswers] = useState(() => {
		// create an object mirroring the structure of the questions object, but with all values set to false
		let state = {}
		for (const prompt in questions) {
			state[prompt] = {}
			for (const answerStr in questions[prompt]) {
				state[prompt][answerStr] = false
			}
		}
		return state
	})

	// update the answer state nopping the selected answer (toggle between true and false)
	function handleClick(question, answer) {
		setAnswers(prevState => {
			let newState = {
				// make a copy of the previous state using the spread operator (...prevState)
				...prevState,
				// then, for the selected question, a new object is created by spreading the previous state of the question and updating the value of the selected answer
				[question]: {
					...prevState[question],
					[answer]: !prevState[question][answer]
				}
			}
			return newState
		})
	}

	function handleSubmit(e) {
		e.preventDefault()
		let count = 0
		let total = 0
		for (const prompt in questions) {
			for (const answer in questions[prompt]) {
				if (answers[prompt][answer] == questions[prompt][answer])
					count++;
				total++;
			}
		}
		onScoreComputed(100 * count / total);
	}

	// create for each question a list of selectable buttons with the possible answers
	let exercise = [];
	let count = 0;
	for (const question in questions) {
		const selectables = []
		for (const answer in questions[question]) {
			selectables.push(<div><button id={"id_" + count} key={"selectable_" + answer}
				// The className is set to either 'bug-selected' or 'bug-selectable' depending on whether the current answer has been selected
				className={`${answers[question][answer] ? 'bug-selected' : 'bug-selectable'
					} mb-2 mt-1`}
				// update the selectable state when the button is clicked
				onClick={() => handleClick(question, answer)}>
				{answer}
			</button></div>)
			count++;
		}
		exercise.push(<>
			<h1><b>{question}</b></h1>
			<pre><code>{selectables}</code></pre>
			<br />
		</>)
	}

	return (
		<>
			<form id='exercise-form' onSubmit={handleSubmit}></form>
			<pre><code>{text}</code></pre>
			{exercise}
		</>
	)
}
