"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";

import { getStorylineList } from '@/app/actions';
import CircleMission from '@/components/button/circle_mission';
import Loading from '@/components/loading/loading';

/**
 * Renders the Landing component.
 * This component displays a list of storylines if the user is logged in,
 * otherwise it redirects to the login page.
 *
 * @returns {JSX.Element} The rendered Landing component.
 */
export default function Landing() {
	const router = useRouter()
	const [storylines, setStorylines] = useState(null)

	useEffect(() => {
		//when logged in show storylines, otherwise go to login page
		getAuth().onAuthStateChanged(function (user) {
			if (user) {
				// get a list with all storylines
				getStorylineList().then(newStorylines => {
					setStorylines(newStorylines)
				})
			} else
				router.push("/login")
		});
	}, []);

	if (!storylines)
		return <Loading />

	return (
		< div className='p-10' >
			<h1 className='text-center text-4xl font-bold text-white'>Welcome to Test Quests!</h1>
			<h3 className='text-center text-2xl text-gray-300 pb-4'>Choose a storyline to start your adventure</h3>
			{
				// iterate over the storylines and create a button for each one
				storylines.map((storyline, index) => (
					<div key={`${storyline}_${index}`} className='text-center m-5 align-middle'>
						<Link href={`/storyline/${storyline}`} id={`storyline_${index}`}>
							<CircleMission type={'gradient-' + (index % 3)}>
								{storyline.charAt(0).toUpperCase() + storyline.slice(1)}
							</CircleMission>
						</Link>
					</div>
				))
			}
		</div >
	);
}
