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
import Loading from "@/components/loading/loading";
import Dialog from "@/components/dialog/dialog";

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
	// convert the difficulty to the chapter name
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

	// Retrieve missions and user progress
	async function retrieveMissions(difficultyLevel) {
		const userInfo = await getUserData()
		// Retrieve the list of missions by difficulty and storyline level from the database
		const missions = await getChapterMissions(difficultyLevel, params.language)
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
	 * allign the title of the mission with the circle (the position of the circle changes based on the mission number)
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
			// the onlick function spawns the locked mission dialog
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
		// Get the user score for the mission
		const userScore = await getUserScoreForMission(missionId);
		const missionNum = missionId.split("_")[1]
		// allign the title of the mission with the circle (the position of the circle changes based on the mission number)
		const translation = getTranslation(missionNum)
		// render the bubble with the mission name and the user score
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

	useEffect(() => {
		/* when logged in show missions, otherwise go to login page */
		getAuth().onAuthStateChanged(function (user) {
			if (user) {
				// get and show missions to the user
				retrieveMissions(`${params.difficulty}`).then(newMissions => {
					setMissions(newMissions)
				})
			} else
				router.push("/login")
		});
	}, []);

	if (!missions)
		return <Loading />

	return (
		<div className='p-10'>

			<h1 className='text-center text-4xl font-bold text-white mb-2'>{chapterName}</h1>
			<h3 className='text-center text-2xl text-gray-300 mb-10'>Difficulty: {difficulty}</h3>

			{missions}

			<Dialog
				title="Mission Locked"
				message="Please complete previous missions to access this one"
				buttonText="OK"
				buttonOnClick={()=>{setVisibleDialog(false)}}
				buttonColor="purple"
				visible={visible_dialog}
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
