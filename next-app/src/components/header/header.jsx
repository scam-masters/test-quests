"use client"
import { useState, useEffect, use } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link"
import Points from './points';

// Firebase authentication
import { getAuth } from "firebase/auth";
import { app } from "../../firebase/index"
import { useRouter } from "next/navigation"
import { getUserData } from "@/app/user_actions";
import { usernameStore } from '@/stores/store';

// export to obtain authentication inside the header and use this istance in pages
export const auth = getAuth(app);

function Header() {
	const pathname = usePathname();
	const router = useRouter()
	const [currentUser, setCurrentUser] = useState(null);
	const [points, setPoints] = useState(0);

	const username = usernameStore((state) => state.username)
	const setUsername = usernameStore((state) => state.setUsername)

	// ******************* Retrieve points ******************* //
	async function retrievePoints() {
		const userInfo = await getUserData();
		return userInfo.score;
	}

	// ******************* Retrieve username ******************* //
	async function retrieveUsername() {
		const userInfo = await getUserData();
		return userInfo.username;
	}

	// ******************* Retrieve if the user can access the exercise ******************* //
	async function getUserAccess() {
		const userInfo = await getUserData();
		if (pathname.includes("exercise") || pathname.includes("learning")) {
			// get the mission number
			const missionNumber = pathname.split("/").at(-1);
			// compare the number of missions completed retrieved from the db with the mission number
			return Object.getOwnPropertyNames(userInfo.missions).length >= missionNumber;

		}
		return true;
	}

	useEffect(() => {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				setCurrentUser(auth.currentUser);
			} else {
				setCurrentUser(null);
			}
		});
		/* when logged in show points, otherwise go to login page */
		getAuth().onAuthStateChanged(function (user) {
			if (user) {
				// check if the user can access the exercise
				getUserAccess().then(access => {
					if (!access) {
						router.push("/")
					}
				})
				retrievePoints().then(newPoints => {
					setPoints(newPoints);
				})
				retrieveUsername().then(newUsername => {
					setUsername(newUsername);
				})
			} else {
				if (pathname !== "/Login" && pathname !== "/Registration" && pathname !== "/scoreboard" && !pathname.includes("/profile")) {
					router.push("/Login")
				}
			}
		});

	}, []);

	return (
		<header className="w-full grid grid-cols-3 items-center bg-tq-primary z-50 justify-between">
			{/* Font Awesome for seach icon */}
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
				
			<div className="text-white font-bold mr-30">
				<Link href="/scoreboard"><button>Scoreboard</button></Link>
				{currentUser ? (
					<button onClick={() => {
						auth.signOut()
						router.push("/Login")		// TODO: check if this is necessary
					}}>Logout</button>
				) : (
					<>
						<Link href="/Login"><button>Login</button></Link>
						<Link href="/Registration"><button>Register</button></Link>
					</>
				)}
				{/* search icon */}
				<Link href="/searchPlayers"><button title="Search for players" class="fa fa-search"></button></Link>
			</div>

			<Link href="/" className="mx-auto">
				<img alt="logo" src="/assets/logo-transparent.svg" className="h-24" />
				<h1 className='font-logo text-tq-white h-0 -translate-y-11 '>TEST QUESTS</h1>
			</Link>

			<div className="flex flex-row justify-end overflow-hidden">
				{currentUser ? (
					<Points username={username} points={points} />
				) : (
					<Points />
				)}
			</div>
		</header >
	)
}

export default Header
