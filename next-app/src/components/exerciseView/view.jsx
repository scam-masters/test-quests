'use client'; // compute the function on server side (as the function is async)
import React, { useState } from "react";
import Button from "@/components/button/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Dialog } from "primereact/dialog";
import { updateUserScore, updateInitialScore } from "@/app/user_actions.js"

import Link from "next/link"

export default function ExerciseView({ exerciseExplanation, resource, Exercise, missionId, exerciseArguments }) {
	const [correctness, setCorrectness] = useState(0);
	const [visible_dialog, setVisibleDialog] = useState(false);

	const ExercisePoints = exerciseArguments.points;

	/* Handle the score computing from D&DExercise.js */
	const handleCorrectnessComputed = (computedCorrectness) => {
		setCorrectness(Math.round(computedCorrectness));
	};

	/* Show the dialog/popup with the score */
	const handleSubmit = () => {
		updateInitialScore();
		setVisibleDialog(true);
	};

	const handleCloseDialog = () => {
		setVisibleDialog(false);
	};
	return (
		<>
			<Splitter className="h-3/4 border-4 m-2" gutterSize={10}>
				{/* Column for the exercise description */}
				<SplitterPanel
					className="flex flex-col border-r-4 overflow-y-auto scrollbar-hide"
					minSize={20}
					size={40}
				>
					<div className="h-full px-2">{exerciseExplanation}</div>
				</SplitterPanel>

				{/* Right column for drag and drop */}
				<SplitterPanel className="border-l-4" minSize={20} size={60}>
					<div id="pane2_1" className="h-full">
						<div className="p-4 text-white">
							<Exercise
								onScoreComputed={handleCorrectnessComputed}
								{...exerciseArguments}
							></Exercise>
						</div>
					</div>
				</SplitterPanel>
			</Splitter>

			{/* Dialog to display the correctness when the user fill all the blanks */}
			<Dialog
				id = "popup"
				header="Submit Results"
				visible={visible_dialog}
				className=" w-auto rounded-sm min-w-1/3"
				onHide={handleCloseDialog}
			>
				<div>
					{correctness === -1 && (
						<div>
							<p className="text-center mb-4 text-4xl">CHEATER!</p>
							<p className="text-center mb-4 text-xl">
								You need to fill all the blanks!
							</p>
						</div>
					)}
					{correctness === 100 && (
						<div className="flex justify-center ">
							<p className="text-center mb-8 text-4xl">
								{correctness}%
								<br />
								Congratulations!
								<br />
								<br />
								You have earned {ExercisePoints} points!
								{updateUserScore(missionId, ExercisePoints)}
							</p>
						</div>
					)}
					{correctness < 100 && correctness >= 80 && (
						<div className="flex justify-center ">
							<p className="text-center mb-8 text-4xl">
								{correctness}%
								<br />
								You are almost there!
							</p>
						</div>
					)}
					{correctness < 80 && correctness >= 20 && (
						<div className="flex justify-center ">
							<p className="text-center mb-8 text-4xl">
								{correctness}%
								<br />
								Give it another chance!
							</p>
						</div>
					)}
					{correctness < 20 && correctness >= 0 && (
						<div className="flex justify-center ">
							<p className="text-center mb-8 text-4xl">
								{correctness}%
								<br />
								You need more effort!
							</p>
						</div>
					)}
					<div className="flex justify-center mt-4">
						{correctness < 100 && (
							<Button type="green" onClick={handleCloseDialog}>
								Let&apos;s try again!
							</Button>
						)}
						{correctness === 100 && (
							<a href='/'>
								<Button type="blue">
									Continue
								</Button>
							</a>
						)}
					</div>
				</div>
			</Dialog>

			<div className="grid grid-cols-3 justify-between  mx-auto ml-4 mr-4">
				<Link href="/">
					<Button type='blue'>
						Go back to main page
					</Button>
				</Link >
				<div className="flex justify-center">
					<Button href={resource} type='green' external>
						Learn More
					</Button>
				</div>
				<div className="flex justify-end">
					<Button type="red" onClick={handleSubmit} id="submit_button" form='exercise-form'>
						Submit
					</Button>
				</div>
			</div>
		</>
	);
}
