"use client"

import { useState } from "react"

export default function MultipleSelection({ text, questions, onScoreComputed }) {
	const [answers, setAnswers] = useState(() => {
		let state = {}
		for (const prompt in questions) {
			state[prompt] = {}
			for (const answerStr in questions[prompt]) {
				state[prompt][answerStr] = false
			}
		}
		return state
	})

	function handleClick(question, answer) {
		setAnswers(prevState => {
			let newState = {
				...prevState,
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

	let exercise = [];
	let count = 0;
	for (const question in questions) {
		const selectables = []
		for (const answer in questions[question]) {
			selectables.push(<div><button id={"id_"+count} key={"selectable_" + answer}
				className={`${answers[question][answer] ? 'bug-selected' : 'bug-selectable'
					} mb-2 mt-1`}
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
