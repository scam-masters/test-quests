'use client';
import React, { useState, useRef, useEffect } from "react";
import Button from "@/components/button/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { updateUserScore, updateInitialScore, updateChapterUnlocking } from "@/app/user_actions.js"
import { checkStorylineCompletion } from "@/app/actions.js"

import Link from "next/link"

export function Timer({ time }) {
	return (<div id="timer">{Math.floor(time / 60).toString().padStart(2, "00")}:{(time % 60).toString().padStart(2, "00")}</div>)
}

function ExerciseDialog({ correctness, handleCloseDialog, visible, exercisePoints, newChapterUnlock, isFinishedStoryline, missionChapter, threshold, missionId }) {
	let title = `${correctness}%`
	let resultMsg
	let storylineMsg = ""
	let chapterMsg = ""
	let missionNumber = missionId.split('_')[1]
	let button = <Button type="green" href={`/learning/${missionNumber}`}>Let's try again!</Button>

	if (correctness >= threshold) {
		resultMsg = <>
			Congratulations!
			<br />
			You have earned {exercisePoints} points!
		</>
		let continueButton
		// add the message for the finish storyline
		if (isFinishedStoryline) {
			storylineMsg = "Congratulations! You have finished this storyline!";
			continueButton = <Button classNames="mt-2" type="blue" href="/">Continue</Button>;
			chapterMsg = "You have finished the last Chapter!";
		} else if (newChapterUnlock) {
			chapterMsg = "You have unlocked the next Chapter!";
			continueButton = <Button classNames="mt-2" type="blue" href="/">Continue</Button>;
		} else {
			continueButton = <Button classNames="mt-2" type="blue" href={missionChapter}>Continue</Button>;
		}
		if (correctness < 100) {
			button = <>
				{button}
				{continueButton}
			</>
		} else {
			button = continueButton
		}
	} else if (correctness >= 80) {
		resultMsg = "You are almost there!"
	} else if (correctness >= 20) {
		resultMsg = "Give it another chance!"
	} else if (correctness >= 0) {
		resultMsg = "You need more effort!"
	} else if (correctness === -1) {
		title = "CHEATER!"
		resultMsg = "You need to fill all the blanks!"
	}

	return (visible ?
		<div id="popup" className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50" onClick={handleCloseDialog}>
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto rounded-xl min-w-1/3 bg-tq-primary p-10">
				<button className="absolute top-0 right-0 p-5 text-red-500 ml-4" onClick={handleCloseDialog}>X</button>
				<div>
					<p className="text-center mb-4 text-4xl">{title}</p>
					<p className="text-center mb-4 text-xl">{resultMsg}</p>
					<p className="text-center mb-4 text-xl">{chapterMsg}</p>
					<p className="text-center mb-4 text-xl">{storylineMsg}</p>
				</div>
				<div className="flex flex-col w-full justify-center mt-4">
					{button}
				</div>
			</div>
		</div>
		: null)
}

export default function ExerciseView({ exerciseExplanation, resource, Exercise, missionId, missionChapter, exercisePoints, exerciseArguments, exerciseThreshold, time, hint }) {
	const [correctness, setCorrectness] = useState(0);
	const [isDialogVisible, setVisibleDialog] = useState(false);
	const [isUnlockingNewChapter, setUnlockNewChapter] = useState(false);
	const [isFinishedStoryline, setFinishedStoryline] = useState(false);
	const [missionScore, setMissionScore] = useState(false);

	// we don't want to use the state for the timer, because it will be re-rendered every time the count decreases
	const timeout = useRef(null)
	const interval = useRef(null)
	const [remainingTime, setRemainingTime] = useState(time)

	function startTimer() {
		if (time) {
			setRemainingTime(time)
			console.log("started timer")
			// Schedules execution of a one-time callback after 1000 milliseconds.
			timeout.current = setTimeout(() => {
				console.log("time is up")
				document.getElementById("submit_button").click()
			}, time * 1000)
			
			// Schedules repeated execution of callback every 1000 milliseconds.
			interval.current = setInterval(() => {
				setRemainingTime(x => Math.max(x - 1, 0))
			}, 1000)
		}
	}

	function stopTimer() {
		if (time) {
			console.log("stopped timer")
			setRemainingTime(0)
			// clear the timeout and interval
			clearTimeout(timeout.current)
			clearInterval(interval.current)
		}
	}

	// use effect will be called twice on debug build 
	useEffect(() => {
		console.log("loaded")
		startTimer()
		// cleanup function. Called when the component unmounts (user navigates away from this page)
		return stopTimer
	}, []);

	// This will be called once by the exercise when the player finishes
	const handleCorrectnessComputed = async (computedCorrectness) => {
		console.log("submitted")
		stopTimer()

		const correctness = Math.round(computedCorrectness)
		const missionScore = Math.round(exercisePoints * correctness / 100)
		// update the user score and unlock the next mission if necessary
		await updateUserScore(missionId, missionScore, correctness, exerciseThreshold)

		setCorrectness(correctness);
		setMissionScore(missionScore);
		// if the user has passed the mission, update the badges and
		if (correctness >= exerciseThreshold) {
			// check if the user has unlocked the next chapter to give him a badge and notify into the dialog (updateChapterUnlocking returns a boolean)
			// used by ExerciseDialog to display the message
			const unlock = await updateChapterUnlocking(missionId)
			// check if the user has finished the storyline to give him a badge and notify into the dialog (checkStorylineCompletion returns a boolean)
			// used by ExerciseDialog to display the message
			const finishedStoryline = await checkStorylineCompletion(missionId)
			setUnlockNewChapter(unlock);
			setFinishedStoryline(finishedStoryline);
		}
		setVisibleDialog(true);
	};

	const handleCloseDialog = () => {
		setVisibleDialog(false);
		startTimer()
	};

	return (
		<>
			{time && Timer({ time: remainingTime })}
			<Splitter className="flex-auto h-0 border-4 m-2 bg-tq-black border-tq-accent" gutterSize={5}>
				{/* Column for the exercise description */}
				<SplitterPanel
					className="flex flex-col border-r-4 overflow-auto border-tq-accent"
					minSize={20}
					size={40}
				>
					<div className="h-full px-2">{exerciseExplanation}</div>
				</SplitterPanel>

				{/* Right column for drag and drop */}
				<SplitterPanel className="border-l-4 overflow-auto border-tq-accent" minSize={20} size={65}>
					<div id="pane2_1" className="h-full">
						<div className="p-4 text-white">
							<div className="text-xl mb-4 font-bold">{hint}</div>
							<Exercise
								onScoreComputed={handleCorrectnessComputed}
								{...exerciseArguments}
							></Exercise>
						</div>
					</div>
				</SplitterPanel>
			</Splitter>

			{/* Dialog to display the correctness when the user fill all the blanks */}
			<ExerciseDialog
				correctness={correctness}
				handleCloseDialog={handleCloseDialog}
				exercisePoints={missionScore}
				visible={isDialogVisible}
				newChapterUnlock={isUnlockingNewChapter}
				isFinishedStoryline={isFinishedStoryline}
				missionChapter={missionChapter}
				threshold={exerciseThreshold}
				missionId={missionId}
			/>

			<div className="grid grid-cols-3 justify-between mx-auto ml-4 mr-4">
				<Link href={missionChapter}>
					<Button type='blue'>
						Go back to chapter page
					</Button>
				</Link >
				<div className="flex justify-center">
					<Button href={resource} type='green' external>
						Learn More
					</Button>
				</div>
				<div className="flex justify-end">
					<Button type="red" id="submit_button" form='exercise-form'>
						Submit
					</Button>
				</div>
			</div>
		</>
	);
}
