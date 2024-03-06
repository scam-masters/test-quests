"use client";

import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase/index";
import { useRouter } from "next/navigation";
import { setNewUsername } from "@/app/user_actions";
import { usernameStore } from '@/stores/store';

/**
 * Function that renders the change username page.
 * 
 * @returns {JSX.Element} The change username page component.
 */
export default function ChangeUsername() {
	const router = useRouter()
	const [error, setError] = useState(null);

	// access the username state from store
	const username = usernameStore((state) => state.username)
	// access the setUsername function from store for setting the username
	const setUsername = usernameStore((state) => state.setUsername)

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null)

		// Get the new username from the form: event.target refers to the form
		const formData = new FormData(event.target)
		const newUsername = formData.get("username-input")

		if (!newUsername) {
			setError("Please fill all the fields.")
			return
		} else if (newUsername.includes(' ')) {
			setError("Usernames can't contain spaces.")
			return
		}

		try {
			// Call the setNewUsername function from user_actions.js to update the username in the database and inside the friends list of the user's friends
			await setNewUsername(getAuth(app), newUsername)
			setUsername(newUsername)
			router.push(`/profile/${newUsername}`)
		} catch (error) {
			setError(error.message)
		}
	};

	return (
		<div className="bg-cover bg-center flex justify-center items-center min-h-screen">
			<div className="bg-black bg-opacity-80 text-white w-96 p-8 rounded-lg shadow-md mt-[-150px]">
				<h1 className="mb-2 text-3xl text-center font-bold">Change Username</h1>
				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<div className="flex flex-col">
						<label className="mb-1">New Username</label>
						<input
							className="border rounded px-2 py-1 bg-white text-black"
							name="username-input"
							type="text"
							id="username-input"
							autoComplete="username"
						/>
					</div>
					<button
						type="submit"
						className="bg-tq-primary hover:bg-tq-accentfont-bold py-2 px-4 rounded"
					>
						Submit
					</button>
					{error && <div className="text-red-500 mb-4" id="error_msg">{error}</div>} {/* Display error message */}
				</form>
			</div>
		</div>
	);
}
