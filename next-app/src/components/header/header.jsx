"use client"
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link"
import Points from './points';

// Firebase authentication
import { getAuth } from "firebase/auth";
import { app } from "../../firebase/index"
import { useRouter } from "next/navigation"

import { getUserData } from "@/app/user_actions";

// export to obtain authentication inside the header and use this istance in pages
export const auth = getAuth(app);

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

	useEffect(() => {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				setCurrentUser(auth.currentUser);
			} else {
				setCurrentUser(null);
			}
		});
	}, []);

	useEffect(() => {
		/* when logged in show points, otherwise go to login page */
		getAuth().onAuthStateChanged(function(user) {
			if (user) {
				retrievePoints().then(newPoints => {
					setPoints(newPoints);
				})
				retrieveUsername().then(newUsername => {
					setUsername(newUsername);
				})
			} else {
				console.log("current url: " + pathname);
				if (pathname !== "/Login" && pathname !== "/Registration") {
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

			<div className="flex flex-row justify-end">
				{currentUser ? (
					<Points username={username} points={points} />
				) : (
					<Points />
				)}

				{currentUser ? (
					<button onClick={() => {
						auth.signOut()
						router.push("/Login")
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
