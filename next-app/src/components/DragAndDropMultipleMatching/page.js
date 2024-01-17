"use client";
import React, { useEffect, useState } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Answer from '@/components/dnd/answer'

export default function DndMmExercise({ onScoreComputed: onCorrectnessComputed, options, blocks, solution, points }) {
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

		for (let i = 0; i < solution.length; i++) {
			if (solution[i] === answers[i])
				count++;
		}

		return count / solution.length * 100;
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
	function parseInput(draggableAnswers, blocks) {
		let res = [];
		for (let i = 0; i < blocks.length; i++) {
			res[i] = (
				<tr>
					<td>{draggableAnswers[i]}</td>
					<td>{blocks[i]}</td>
				</tr>);
		}

		return res;
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<p>Complete the exercise:</p>
			<br />
			<table>
				<tbody>
					{parseInput(draggableAnswers, blocks)}
				</tbody>
			</table>
			<p className='mt-5'>Compose it starting from these blocks:</p>
			<div className="min-w-max grid grid-cols-1 gap-1">
				{draggableAnswers.slice(solution.length)}
			</div>

		</DndProvider>
	)
}


