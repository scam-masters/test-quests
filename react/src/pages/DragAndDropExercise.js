import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


import Answer from '../components/dnd/answer'

function DndExercise({ onScoreComputed }) {
	const [answers, setAnswers] = useState([
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
			console.log("swapping")
			//console.log(a)

			return a
		})
	}

	function ComputeScore(answers){
	
		const solution = ["file=","../","../","server/","flag.txt"];
		var score, count = 0;
		var missing = false;
		var solution_lenght = solution.length;
		for(var i = 0; i < solution_lenght; i++){
			// console.log(solution[i])
			// console.log(answers[i])
			if(solution[i] === answers[i])
				count++;
			if(answers[i] === null)
				missing = true;
		} 
		if(!missing){
			score = count / solution_lenght * 100;
			console.log(score);
			return score;
		}
		else return -1; // return -1 to recognize wheter the user have not filled yet
	}

	let draggableAnswers = []

	answers.forEach((x, i) => {
		draggableAnswers.push(<Answer key={i} id={i} text={x} swap={swap}/>)
	})

	// Call the onScoreComputed function with the computed score
	onScoreComputed && onScoreComputed(ComputeScore(answers));

	return (
		<DndProvider backend={HTML5Backend}>
			<p>The query you have to make is:</p>
			<br/>
			<p>
				{draggableAnswers.slice(0, 4)}
				secrets/
				{draggableAnswers[4]}
			</p>
			<p className='mt-5'>Compose it starting from these blocks:</p>
			<div className="min-w-max grid grid-cols-4 gap-1">
				{draggableAnswers.slice(5)}
			</div>

		</DndProvider>
	)
}


export default DndExercise
