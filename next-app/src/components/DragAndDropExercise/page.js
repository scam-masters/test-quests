"use client";
import React, { useEffect, useState } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Answer from '@/components/dnd/answer'

function shuffle(array) {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}

export default function DndExercise({ onScoreComputed: onCorrectnessComputed, data, solution }) {
	let data = ["files.php", "?", "file=", "../", "../", "server/", "flag.txt"]
	useEffect(() => {
		data = shuffle(data)
	});
	data = shuffle(data)
	console.log(data);
	// buld an array of nulls of size data.size
	let nulls = Array(data.length).fill(null)
	data = nulls.concat(data)
	console.log(data);
	const [answers, setAnswers] = useState(data)

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


