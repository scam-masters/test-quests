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
		var correctness, count = 0;
		var missing = false;
		var solution_lenght = solution.length;

		for (var i = 0; i < solution_lenght; i++) {
			if (solution[i] === answers[i])
				count++;
			if (answers[i] === null)
				missing = true;
		}
		if (!missing) {
			correctness = Math.floor(count / solution_lenght * 100);
			return correctness;
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
		var res = Array(input.length).fill(null);

		for (var i = 0, blank = 0; i < input.length; i++) {
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
			<p>The query you have to make is:</p>
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


