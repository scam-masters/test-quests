"use client";

import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase/index";
import { useRouter } from "next/navigation";
import { setNewUsername } from "@/app/user_actions";
import { usernameStore } from '@/stores/store';

export default function changeUsername() {
	const router = useRouter()
	const [error, setError] = useState(null);

	const username = usernameStore((state) => state.username)
	const setUsername = usernameStore((state) => state.setUsername)

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null)

		const formData = new FormData(event.target)
		const newUsername = formData.get("username")

		if (!newUsername) {
			setError("Please fill all the fields.")
			return
		} else if (newUsername.includes(' ')) {
			setError("Usernames can't contain spaces.")
			return
		}

		try {
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
							name="username"
							type="text"
							id="username"
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
