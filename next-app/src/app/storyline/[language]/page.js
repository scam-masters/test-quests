"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";

import { getMissionList } from '@/app/actions';
import { getUserData, getUserScoreForMission } from '@/app/user_actions';
import CircleMission from '@/components/button/circle_mission';

import Button from '@/components/button/button'
import Loading from '@/components/Loading';

/**
 * Renders a list of chapters with clickable links based on the provided language, counter, and onClickChapterLocked function.
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
				<div key={chapter.id} className='text-center m-5 align-middle'>
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

// ******************* Retrieve chapters and user progress ******************* //
/**
 * Retrieves the chapters for a given language and user progress.
 * 
 * @param {string} language - The language for which to retrieve the chapters.
 * @param {function} onClickChapterLocked - The callback function to handle click events on locked chapters.
 * @returns {Promise<DisplayChapters>} A promise that resolves with the display of chapters.
 */
async function retrieveChapters(language, onClickChapterLocked) {
	// retrieve all the list to check the progress of the user in the mission
	// to display correclty chapters (watch line 43 for possible improvement)
	const userInfo = await getUserData()
	const missions = await getMissionList(language) //  Retrieve the list of missions from the database

	// todo: take missions that belong to language from params

	// For each mission, check if it is included in the user progress
	// If so, let's extract the difficulty of the mission performed 
	// by the user in order to understand which chapter display
	let counter = 0;

	for (let m in missions) {
		// TODO: change this checking only the difficulty of the last mission 
		// performed by the user to avoid checking all the missions
		if (missions[m].id in userInfo.missions) {
			// check for the difficulty
			if (missions[m].data.difficulty == "easy" && counter < 1) counter = 1;
			else if (missions[m].data.difficulty == "medium" && counter < 2) counter = 2;
			else if (missions[m].data.difficulty == "hard" && counter < 3) counter = 3;
		}
	}
	return DisplayChapters(language, counter, onClickChapterLocked);
}


/**
 * Renders a dialog component.
 *
 * @param {Object} props - The props for the dialog component.
 * @param {boolean} props.visible - Determines whether the dialog is visible or not.
 * @param {Function} props.handleCloseDialog - The function to handle closing the dialog.
 * @returns {JSX.Element|null} The rendered dialog component or null if not visible.
 */
function Dialog(props) {
	return (props.visible ?
		<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50" onClick={props.handleCloseDialog}>
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto rounded-xl min-w-1/3 bg-tq-primary p-10">
				<button className="absolute top-0 right-0 p-5 text-red-500 ml-4" onClick={props.handleCloseDialog}>X</button>
				<div>
					<p className="text-center mb-4 text-4xl text-white">Chapter Locked</p>
					<p className="text-center mb-4 text-xl text-white">Please complete previous chapter's missions to access this chapter</p>
				</div>
			</div>
		</div>
		: null)
}


/**
 * Represents the Storyline component.
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters passed to the component.
 * @returns {JSX.Element} The rendered Storyline component.
 */
export default function Storyline({ params }) {
	const router = useRouter()
	const [visible_dialog, setVisibleDialog] = useState(false);
	const [chapters, setChapters] = useState(null)
	const [language, setLanguage] = useState(params.language)

	const onClickChapterLocked = () => {
		setVisibleDialog(true)
	}

	const handleCloseDialog = () => {
		setVisibleDialog(false);
	};


	useEffect(() => {
		/* when logged in show missions, otherwise go to login page */
		getAuth().onAuthStateChanged(function(user) {
			if (user) {
				retrieveChapters(params.language, onClickChapterLocked).then(newChapters => {
					setChapters(newChapters)
				})
			} else
				router.push("/Login")
		});
	}, []);

	if (!chapters)
		return <Loading />

	return (
		<>
			<div className='p-10'>
				<h1 className='text-center text-4xl font-bold text-tq-white mb-2'>{language.charAt(0).toUpperCase() + language.slice(1)}</h1>
				{chapters}
				<Dialog
					// className='bg-tq-black text-tq-white w-1/2 h-auto'
					// header="Chapter Locked"
					visible={visible_dialog}
					handleCloseDialog={handleCloseDialog}
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
