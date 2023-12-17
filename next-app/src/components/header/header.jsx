"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link"
// Firebase stuff
import app from "../../firebase/index";
import { getAuth } from "firebase/auth";
import firebase from 'firebase/app';

const auth = getAuth();

function Header() {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				setCurrentUser(auth.currentUser);
			} else {
				setCurrentUser(null);
			}
		});
	}, []);

	return (
		<header className="w-full flex items-center bg-tq-primary z-50 justify-between">
			<Link href="/" className="mx-auto">
				<img alt="logo" src="/assets/logo-transparent.svg" className="h-24" />
				<h1 className='font-logo text-tq-white h-0 -translate-y-11'>TEST QUESTS</h1>
			</Link>

			<div className="mr-0">
				{currentUser ? (
					<button onClick={() => auth.signOut()}>Logout</button>
				) : (
					<div>
						<Link href="/Login"><button>Login</button></Link>
						<Link href="/Registration"><button>Register</button></Link>
					</div	>
				)}
			</div>
		</header >
	)
}

export default Header
