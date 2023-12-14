"use client";
import React, { useEffect, useState } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Answer from '@/components/dnd/answer'

export default function DndExercise({ onScoreComputed: onCorrectnessComputed }) {
	const [answers, setAnswers] = useState([
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		"?",
		"../",
		"flag.txt",
		"file=",
		"../",
		"files.php",
		"server/"
	])

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
		const solution = ["files.php", "?", "file=", "../", "../", "server/", "flag.txt"];
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

	let draggableAnswers = answers.map((x, i) => {
		return (<Answer key={i} id={i} text={x} swap={swap} />)
	})

	useEffect(() => {
		onCorrectnessComputed && onCorrectnessComputed(ComputeCorrectness(answers));
	}, [answers])

	return (
		<DndProvider backend={HTML5Backend}>
			<p>The query you have to make is:</p>
			<br />
			<p>
				example.com/
				{draggableAnswers.slice(0, 6)}
				secrets/
				{draggableAnswers[6]}
			</p>
			<p className='mt-5'>Compose it starting from these blocks:</p>
			<div className="min-w-max grid grid-cols-4 gap-1">
				{draggableAnswers.slice(7)}
			</div>

		</DndProvider>
	)
}


