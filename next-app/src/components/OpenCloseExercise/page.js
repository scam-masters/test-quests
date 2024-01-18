"use client";

/*
* solution: Array<string>
* blocks: Array<string>, empty string for places to be completed
* */
export default function OpenCloseExercise({ onScoreComputed, blocks, solution }) {
	// compute correctness when submitting the form
	function handleSubmit(e) {
		e.preventDefault()
		const answers = new FormData(e.target)

		let correctness = 0;
		for (var i = 0; i < solution.length; i++) {
			const answer = answers.get(i)
			if (answer === null) {
				onScoreComputed(-1)
				return
			}

			if (solution[i].trim().toLowerCase() == answer.trim().toLowerCase()) {
				correctness++
			}
		}

		console.log(correctness)
		onScoreComputed(correctness * 100 / solution.length)
	}

	// function to parse the input and replace the blanks with open answers
	function parseInput(blocks) {
		let res = [];

		for (let i = 0, answerId = 0; i < blocks.length; i++) {
			if (blocks[i] === "") {
				res[i] = (<input
					key={answerId}
					name={answerId}
					type="text"
				/>)
				answerId++
			}
			else
				res[i] = blocks[i];
		}

		return res;
	}

	return (
		<>
			<p>Complete the exercise by writing in the boxes:</p>
			<br />
			<form id='exercise-form' onSubmit={handleSubmit}>
				{parseInput(blocks)}
			</form >
		</>
	)
}


