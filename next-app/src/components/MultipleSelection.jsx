"use client"

import { useState } from "react"

export default function DebugExercise({ questions, onScoreComputed }) {
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
	for (const question in questions) {
		const selectables = []
		for (const answer in questions[question]) {
			selectables.push(<div><button key={"selectable_" + answer}
				class={answers[question][answer] ? 'bug-selected' : 'bug-selectable'}
				onClick={() => handleClick(question, answer)}>
				{answer}
			</button></div>)
		}
		exercise.push(<><bold>{question}</bold>
			{selectables}
		</>)
	}

	return (
		<>
			<form id='exercise-form' onSubmit={handleSubmit}></form>
			{exercise}
		</>
	)
}
