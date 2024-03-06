"use client"

// https://react.dev/reference/react/Fragment
import { Fragment } from "react"

export default function DropdownExercise({ text, dropdowns, onScoreComputed: onCorrectnessComputed }) {
	// the text has {} for each dropdown. Dropdowns is an object composed by arrays. Inside the dropdowns object,
	// the index of the array is the index of the dropdown in the text. e.g. the first array contains the options for the first dropdown. 
	// The solutions are represented as the index of the correct answer for each dropdown and are cotained in the dropdowns object.
	// e.g. dropdowns.solutions = [2, 0, 1] means that the first dropdown has the third option as the correct answer, the second dropdown has
	// the first option and so on.
	const solutions = dropdowns.solutions;

	function handleSubmit(e) {
		e.preventDefault()
		const answers = new FormData(e.target)

		let correctness = 0;
		for (var i = 0; i < solutions.length; i++) {
			if (answers.get(i) === null) {
				onCorrectnessComputed(-1)
				return
			}

			if (solutions[i] == answers.get(i)) {
				correctness++
			}
		}

		onCorrectnessComputed(correctness * 100 / solutions.length)
	}

	// The makeSelect function creates a <select> element and creates an <option> element for each option.
	function makeSelect(name, options) {
		return <select key={name} name={name} defaultValue={-1}>
			<option key={-1} value={-1} disabled={true}>--Please select one answer--</option>
			{options.map((x, i) => <option key={i} value={i}>{x}</option>)}
		</select>
	}

	return (
		<form id='exercise-form' onSubmit={handleSubmit}>
			<p>
				{
					text.split("{}").map((t, i) => {
						// Fragment is like <></> but can use key property
						// for each {} in the text insert a <select> element containing the <options> 
						return <Fragment key={i}>
							<span key={'span_' + i} dangerouslySetInnerHTML={{ __html: t }} />
							{t && makeSelect(i, dropdowns['' + i])}
						</Fragment>
					})
				}
			</p>
		</form>
	)
}
