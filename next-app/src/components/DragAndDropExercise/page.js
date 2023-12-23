"use client";
import React, { useEffect, useState } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Answer from '@/components/dnd/answer'

export default function DndExercise({ onScoreComputed: onCorrectnessComputed, blocks, options, solution, points }) {
	// buld an array of nulls of size options.size
	let nulls = Array(options.length).fill(null)

	// blanks + options to be filled
	options = nulls.concat(options)

	// initialize answers with options
	const [answers, setAnswers] = useState(options)

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
	function parseInput(blocks) {
		let res = Array(blocks.length).fill(null);

		for (let i = 0, blank = 0; i < blocks.length; i++) {
			if (blocks[i] === "") {
				res[i] = draggableAnswers[blank++];
			}
			else {
				res[i] = blocks[i];
			}
		}

		return res;
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<p>Complete the exercise:</p>
			<br />
			<p>
				{parseInput(blocks)}
			</p>
			<p className='mt-5'>Compose it starting from these blocks:</p>
			<div className="min-w-max grid grid-cols-4 gap-1">
				{draggableAnswers.slice(solution.length)}
			</div>

		</DndProvider>
	)
}


