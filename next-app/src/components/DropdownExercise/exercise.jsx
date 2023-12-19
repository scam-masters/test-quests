export default function DropdownExercise({ onScoreComputed: onCorrectnessComputed }) {
	const input = (
		<select>
			<option value="">--Please select one answer--</option>
			<option value="dog">Dog</option>
			<option value="cat">Cat</option>
			<option value="hamster">Hamster</option>
			<option value="parrot">Parrot</option>
			<option value="spider">Spider</option>
			<option value="goldfish">Goldfish</option>
		</select>
	)
	
	function handleSubmit (e) {
		e.preventDefault()
		onCorrectnessComputed(100)
	}

	return (
		<form id='exercise-form' onSubmit={handleSubmit}>
			<p>
				Lorem ipsum {input}
				lorem ipsum {input}
				lorem ipsum {input}
				lorem ipsum {input}
				lorem ipsum {input}
			</p>
		</form>
	)
}
