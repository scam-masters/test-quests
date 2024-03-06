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
	// inside the database there are empty blocks (containing "") that in the page will be rendered as input fields
	function parseInput(blocks) {
		let res = [];

		for (let i = 0, answerId = 0; i < blocks.length; i++) {
			if (blocks[i] === "") {
				res[i] = (<input
					style={{ width: "40%", margin: "3px 5px" }}
					key={answerId}
					name={answerId}
					type="text"
				/>)
				answerId++
			}
			// if the block is not empty, render it as a span putting the html retrieves from the database inside
			else {
				res[i] = <span key={i} dangerouslySetInnerHTML={{ __html: blocks[i] }}></span >
			}
		}

		return res;
	}

	return (
		<>
			<form id='exercise-form' autoComplete="none" onSubmit={handleSubmit}>
				{parseInput(blocks)}
			</form >
		</>
	)
}


