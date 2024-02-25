"use client"
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";
import Button from '@/components/button/button';

import { getUserData, getUserScoreForMission } from '@/app/user_actions';
import CircleMission from '@/components/button/circle_mission';

import { getChapterMissions } from "@/app/actions"
import Loading from "@/components/Loading";

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
/**
 * Renders a chapter component.
 * @param {Object} params - The parameters for the chapter.
 * @returns {JSX.Element} - The rendered chapter component.
 */
export default function Chapter({ params }) {
	// Get the current mission
	const router = useRouter()
	const [visible_dialog, setVisibleDialog] = useState(false);
	const [missions, setMissions] = useState(null)
	const difficulty = params.difficulty.charAt(0).toUpperCase() + params.difficulty.slice(1)
	const chapterName = getChapterName(difficulty)

	/**
	 * getChapterName
	 * @param {string} difficulty - the difficulty of the chapter
	 * @returns the name of the chapter
	 * @description returns the name of the chapter based on the difficulty
	 * @example
	 * getChapterName("Easy") // returns "Chapter 1"
	 * getChapterName("Medium") // returns "Chapter 2"
	 * getChapterName("Hard") // returns "Chapter 3"
	 */
	function getChapterName(difficulty) {
		const number =
			difficulty == "Easy" ? 1 :
				difficulty == "Medium" ? 2 :
					difficulty == "Hard" ? 3 : 0
		return `Chapter ${number}`
	}

	/**
	 * MissionLocked
	 * @returns {void} - sets the dialog to visible
	 * @description sets the dialog to visible
	 */
	function MissionLocked() {
		return (
			setVisibleDialog(true)
		)
	}

	/**
	 * handleCloseDialog
	 * @returns {void} - sets the dialog to invisible
	 * @description sets the dialog to invisible
	 */
	function handleCloseDialog() {
		return (
			setVisibleDialog(false)
		)
	}

	// ******************* Retrieve missions and user progress ******************* //
	async function retrieveMissions(difficultyLevel) {
		const userInfo = await getUserData()

		const missions = await getChapterMissions(difficultyLevel, params.language) //  Retrieve the list of missions by difficulty level from the database
		const result = []

		// For each mission, check if it is included in the user progress
		// If so, show the mission as unlocked, otherwise show it locked
		for (let m in missions) {
			if (missions[m].id in userInfo.missions)
				result.push(await unlockedMission(missions[m].id, missions[m].data))
			else
				result.push(lockedMission(missions[m].id))
		}
		return result
	}

	/** getTranslation
	 * set the alignment of the mission circles
	 * @param {number} missionNum - the number of the mission
	 * @returns {string} - the alignment of the mission circle (in tailwindcss format)
	 */
	function getTranslation(missionNum) {
		const alignNum = missionNum % 8
		let alignment = ""
		if (alignNum == 1 || alignNum == 5) {
			// do nothing
		} else if (alignNum == 2 || alignNum == 4) {
			alignment = "translate-x-[110%]"
		} else if (alignNum == 3) {
			alignment = "translate-x-[150%]"
		} else if (alignNum == 6 || alignNum == 8) {
			alignment = "-translate-x-[110%]"
		} else if (alignNum == 7) {
			alignment = "-translate-x-[150%]"
		}
		return alignment
	}

	/**
	 * lockedMission
	 * @param {string} missionId - the id of the mission
	 * @returns {JSX.Element} the locked mission component
	 */
	function lockedMission(missionId) {
		const missionNum = missionId.split("_")[1]
		const translation = getTranslation(missionNum)

		return (
			<div key={missionId} className='text-center m-5 align-middle' onClick={MissionLocked}>
				<CircleMission className={translation} type="locked">Mission Locked</CircleMission>
			</div>
		)
	}

	/**
	 * unlockedMission
	 * @param {string} missionId - the id of the mission
	 * @param {Object} missionData - the data of the mission
	 * @returns {JSX.Element} the unlocked mission component
	 */
	async function unlockedMission(missionId, missionData) {
		const userScore = await getUserScoreForMission(missionId);
		const missionNum = missionId.split("_")[1]
		const translation = getTranslation(missionNum)

		return (
			<div key={missionId} className='text-center m-5 align-middle'>
				<Link href={missionData.learning.learningLink}>
					<CircleMission className={translation} type={"gradient-" + (missionNum % 3 || 1)} userScore={userScore} maxPoints={missionData.points}>
						{missionData.name}
					</CircleMission>
				</Link>
			</div>
		)
	}

	/**
	 * Dialog
	 * @param {Object} props - the properties of the dialog
	 * @returns {JSX.Element} the dialog component
	 */
	function Dialog(props) {
		return (props.visible ?
			<div id="mission_locked_popup" className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50" onClick={handleCloseDialog}>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto rounded-xl min-w-1/3 bg-tq-primary p-10">
					<button className="absolute top-0 right-0 p-5 text-red-500 ml-4" onClick={handleCloseDialog}>X</button>
					<div>
						<p className="text-center mb-4 text-4xl">Mission Locked</p>
						<p className="text-center mb-4 text-xl">Please complete previous missions to access this one</p>
					</div>
				</div>
			</div>
			: null
		)
	}

	useEffect(() => {
		/* when logged in show missions, otherwise go to login page */
		getAuth().onAuthStateChanged(function(user) {
			if (user) {
				retrieveMissions(`${params.difficulty}`).then(newMissions => {
					setMissions(newMissions)
				})
			} else
				router.push("/Login")
		});
	}, []);

	if (!missions)
		return <Loading />

	return (
		<div className='p-10'>

			<h1 className='text-center text-4xl font-bold text-tq-blue mb-2'>{chapterName}</h1>
			<h3 className='text-center text-2xl font-bold text-tq-blue mb-10'>Difficulty: {difficulty}</h3>

			{missions}

			<Dialog
				visible={visible_dialog}
				onHide={handleCloseDialog}
				/>

			{/* "Go back to main page" button */}
			<div className="fixed bottom-0 p-5 left-0 mb-5 z-50">
				<Link href={`/storyline/${params.language}`}>
					<Button type='blue' id="back_to_main">
						Go back to storyline
					</Button>
				</Link>
			</div>
		</div>
	);
}
