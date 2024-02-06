'use client';
import React, { useState } from "react";
import Button from "@/components/button/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Dialog } from "primereact/dialog";
import { updateUserScore, updateInitialScore, updateChapterUnlocking } from "@/app/user_actions.js"

import Link from "next/link"

function ExerciseDialog({ correctness, handleCloseDialog, visible, exercisePoints, newChapterUnlock, missionChapter, threshold }) {
	let title = `${correctness}%`
	let resultMsg
	let chapterMsg = ""
	let button = <Button type="green" onClick={handleCloseDialog}>Let's try again!</Button>

	if (correctness >= threshold) {
		resultMsg = <>
			Congratulations!
			<br />
			You have earned {exercisePoints} points!
		</>
		let continueButton
		if (newChapterUnlock) {
			chapterMsg = "You have unlocked the next Chapter!"
			continueButton = <Button classNames="mt-2" type="blue" href="/">Continue</Button>
		}
		else {
			continueButton = <Button classNames="mt-2" type="blue" href={missionChapter}>Continue</Button>
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

	return (
		<Dialog
			id="popup"
			header="Submit Results"
			visible={visible}
			className="w-auto rounded-sm min-w-1/3"
			onHide={handleCloseDialog}
		>
			<div>
				<div>
					<p className="text-center mb-4 text-4xl">{title}</p>
					<p className="text-center mb-4 text-xl">{resultMsg}</p>
					<p className="text-center mb-4 text-xl">{chapterMsg}</p>
				</div>
				<div className="flex flex-col w-full justify-center mt-4">
					{button}
				</div>
			</div>
		</Dialog>
	)
}

export default function ExerciseView({ exerciseExplanation, resource, Exercise, missionId, missionChapter, exercisePoints, exerciseArguments, exerciseThreshold }) {
	const [correctness, setCorrectness] = useState(0);
	const [isDialogVisible, setVisibleDialog] = useState(false);
	const [isUnlockingNewChapter, setUnlockNewChapter] = useState(false);
	const [missionScore, setMissionScore] = useState(false);

	// This will be called once by the exercise when the player finishes
	const handleCorrectnessComputed = async (computedCorrectness) => {
		const correctness = Math.round(computedCorrectness)
		const unlock = await updateChapterUnlocking(missionId)
		const missionScore = Math.round(exercisePoints * correctness / 100)

		await updateUserScore(missionId, missionScore, correctness, exerciseThreshold)

		setCorrectness(correctness);
		setUnlockNewChapter(unlock)
		setMissionScore(missionScore)
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
			<ExerciseDialog
				correctness={correctness}
				handleCloseDialog={handleCloseDialog}
				exercisePoints={missionScore}
				visible={isDialogVisible}
				newChapterUnlock={isUnlockingNewChapter}
				missionChapter={missionChapter}
				threshold={exerciseThreshold}
			/>

			<div className="grid grid-cols-3 justify-between  mx-auto ml-4 mr-4">
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
