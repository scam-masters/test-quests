"use client"
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link"
import Points from './points';
import { useRouter } from "next/navigation"

// Firebase authentication
import { getAuth } from "firebase/auth";
import { auth,app } from '@/firebase';
// utils
import { getUserData } from "@/app/user_actions";


/*
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "127.0.0.1", 5002);
*/

// export to obtain authentication inside the header and use this istance in pages
// export const auth = getAuth(app);

function Header() {
	const pathname = usePathname();
	const router = useRouter()
	const [currentUser, setCurrentUser] = useState(null);
	const [username, setUsername] = useState("");
	const [points, setPoints] = useState(0);

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
				console.log("current url: " + pathname);
				if (pathname !== "/Login" && pathname !== "/Registration" && pathname !== "/scoreboard") {
					router.push("/Login")
				}
			}
		});

	}, []);

	return (
		<header className="w-full grid grid-cols-3 items-center bg-tq-primary z-50 justify-between">
			<div>
				
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
			</div>
		</header >
	)
}

export default Header
