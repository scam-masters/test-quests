"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";

import { getMissionList } from '@/app/actions';
import { getUserData, getUserScoreForMission } from '@/app/user_actions';
import CircleMission from '@/components/button/circle_mission';
import Dialog from '@/components/dialog/dialog';

import Button from '@/components/button/button'
import Loading from '@/components/loading/loading';

/**
 * Renders a list of chapters accessible by the user with clickable links based on the provided language, counter, and onClickChapterLocked function.
 *
 * @param {string} language - The language of the chapters.
 * @param {number} counter - The counter indicating the current chapter.
 * @param {Function} onClickChapterLocked - The function to be called when a locked chapter is clicked, ideally to display a dialog.
 * @returns {JSX.Element} The JSX element representing the list of chapters.
 */
function DisplayChapters(language, counter, onClickChapterLocked) {
	// Assuming chapters is an array of chapter objects
	const chapters = [
		{ id: 1, title: "Chapter 1", chapterLink: "/chapter/easy" },
		{ id: 2, title: "Chapter 2", chapterLink: "/chapter/medium" },
		{ id: 3, title: "Chapter 3", chapterLink: "/chapter/hard" },
	];

	return (
		<div>
			{chapters.map((chapter, index) => (
				//  For each chapter, a div is created with chapter.id as key
				<div key={chapter.id} className='text-center m-5 align-middle'>
					{/* check if the user has completed the previous chapters (counter is the number of chapters unlocked by the user) */}
					{index < counter ? (
						<Link href={`${language}/${chapter.chapterLink}`} id={`chapter_${chapter.id}`}>
							<CircleMission type={'gradient-' + (chapter.id % 3)}>
								{chapter.title}
							</CircleMission>
						</Link>
					) : (
						<div onClick={onClickChapterLocked}>
							<CircleMission type="locked">
								{chapter.title}
							</CircleMission>
						</div>
					)}
				</div>
			))}
		</div>
	);
}

// Retrieve chapters and user progress 
/**
 * Get the chapters accessible by the user based on the language 
 * 
 * @param {string} language - The language for which to retrieve the chapters.
 * @param {function} onClickChapterLocked - The callback function to handle click events on locked chapters.
 * @returns {Promise<DisplayChapters>} A promise that resolves with the display of chapters.
 */
async function retrieveChapters(language, onClickChapterLocked) {
	// retrieve all the list to check the progress of the user in the missions
	// to display correclty chapters (watch line 43 for possible improvement)
	const userInfo = await getUserData()
	// Retrieve the list of missions from the database based on the language
	const missions = await getMissionList(language) 

	// todo: take missions that belong to language from params

	// For each mission, check if it is included in the user progress
	// If so, extract the difficulty of the mission performed 
	// by the user in order to understand which chapter display
	let counter = 0;

	// very tricky way to check what chapters the user has unlocked. Basically, if the user has
	// completed a mission of a certain difficulty, then the user has unlocked the chapter of that difficulty
	for (let m in missions) {
		// TODO: change this checking only the difficulty of the last mission 
		// performed by the user to avoid checking all the missions
		if (missions[m].id in userInfo.missions) {
			// if the user has completed for example a difficult mission, then should see the third chapter
			if (missions[m].data.difficulty == "easy" && counter < 1) counter = 1;
			else if (missions[m].data.difficulty == "medium" && counter < 2) counter = 2;
			else if (missions[m].data.difficulty == "hard" && counter < 3) counter = 3;
		}
	}
	return DisplayChapters(language, counter, onClickChapterLocked);
}

/**
 * Represents the Storyline component.
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters passed to the component.
 * @returns {JSX.Element} The rendered Storyline component.
 */
export default function Storyline({ params }) {
	const router = useRouter()
	const [visibleDialog, setVisibleDialog] = useState(false);
	const [chapters, setChapters] = useState(null)
	const [language, setLanguage] = useState(params.language)

	const onClickChapterLocked = () => {
		setVisibleDialog(true);
		console.log(visibleDialog);
	}

	const handleCloseDialog = () => {
		setVisibleDialog(false);
	};


	useEffect(() => {
		/* when logged in show missions, otherwise go to login page */
		getAuth().onAuthStateChanged(function (user) {
			if (user) {
				// show the chapters based on the language. newChapters is the html containing the chapters accessible or not by the user
				retrieveChapters(params.language, onClickChapterLocked).then(newChapters => {
					setChapters(newChapters)
				})
			} else
				router.push("/login")
		});
	}, []);

	if (!chapters)
		return <Loading />

	return (
		<>
			<div className='p-10'>
				<h1 className='text-center text-4xl font-bold text-tq-white mb-2'>{language.charAt(0).toUpperCase() + language.slice(1)}</h1>
				{/* chapter contains the html of the chapters accessible or not by the user */}
				{chapters}
				<Dialog
					title="Mission Locked"
					message="Please complete previous missions to access this one"
					buttonText="OK"
					buttonOnClick={() => { setVisibleDialog(false) }}
					buttonColor="green"
					onClose={handleCloseDialog}
					visible={visibleDialog}
				/>
			</div>
			<div className="fixed bottom-0 p-5 left-0 mb-5 z-50">
				<Link href="/">
					<Button type='blue' id="back_to_main">
						Go back to the main page
					</Button>
				</Link>
			</div>
		</>
	);
}
