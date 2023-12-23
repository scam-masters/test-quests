"use client";
import React, { useEffect, useState } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Answer from '@/components/dnd/answer'

export default function DndExercise({ onScoreComputed: onCorrectnessComputed, input, data, solution }) {
	// buld an array of nulls of size data.size
	let nulls = Array(data.length).fill(null)

	// blanks + data to be filled
	data = nulls.concat(data)

	// initialize answers with data
	const [answers, setAnswers] = useState(data)

	// function to swap two elements in the answers array
	function swap(x, y) {
		setAnswers(prev => {
			let a = Array.from(prev)
			let tmp = a[x]
			a[x] = a[y]
			a[y] = tmp
			return a
		})
	}

	function ComputeCorrectness(answers) {
		let count = 0;
		let missing = false;

		for (let i = 0; i < solution.length; i++) {
			if (solution[i] === answers[i])
				count++;
			if (answers[i] === null)
				missing = true;
		}
		if (!missing) {
			return count / solution.length * 100;
		}
		else return -1; // return -1 to recognize wheter the user have not filled yet
	}

	// build the draggable answers
	let draggableAnswers = answers.map((x, i) => {
		return (<Answer key={i} id={i} text={x} swap={swap} />)
	})

	// update the correctness when the answers change
	useEffect(() => {
		onCorrectnessComputed && onCorrectnessComputed(ComputeCorrectness(answers));
	}, [answers])

	// function to parse the input and replace the blanks with the draggable answers
	function parseInput(input) {
		let res = Array(input.length).fill(null);

		for (let i = 0, blank = 0; i < input.length; i++) {
			if (input[i] === "") {
				res[i] = draggableAnswers[blank++];
			}
			else {
				res[i] = input[i];
			}
		}

		return res;
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<p>Complete the exercise:</p>
			<br />
			<p>
				{parseInput(input)}
			</p>
			<p className='mt-5'>Compose it starting from these blocks:</p>
			<div className="min-w-max grid grid-cols-4 gap-1">
				{draggableAnswers.slice(solution.length)}
			</div>

		</DndProvider>
	)
}


