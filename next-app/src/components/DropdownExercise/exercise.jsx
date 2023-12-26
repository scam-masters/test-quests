"use client"

export default function DropdownExercise({ text, dropdowns, onScoreComputed: onCorrectnessComputed }) {
	// the text has {} for each dropdown. Dropdowns is an object of arrays,
	// the object has stringified numbers as keys that indicate the position in the text
	// the solutions are in dropdowns and they indicate the index of the correct answer for each dropdown
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
						return <>{t} {t && makeSelect(i, dropdowns['' + i])} </>
					})
				}
			</p>
		</form>
	)
}
