"use client";

// Import necessary packages
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/firebase/index";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* apparently you can put the api key in the client as long as you enforce what a user can read
 * and write with https://console.firebase.google.com/u/0/project/test-quests-a3712/firestore/rules .
 * See https://firebase.google.com/docs/projects/api-keys */
/**
 * Represents the Login component.
 *
 * @returns {JSX.Element} The rendered Login component.
 */
export default function Login() {
	const router = useRouter()
	const [error, setError] = useState(null); // State for managing error messages

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null)

		const formData = new FormData(event.target)
		const email = formData.get("email")
		const password = formData.get("password")

		if (!email || !password) {
			setError("Please fill all the fields.")
			return
		}

		try {
			await signInWithEmailAndPassword(getAuth(app), email, password)
			router.push("/")
		} catch (error) {
			switch (error.code) {
				case 'auth/invalid-credential':
					setError("Invalid e-mail or password.")
					break;
				default:
					// TODO: maybe handle more errors like network errors
					setError(error.message)
					break;
			}
		}
	};

	return (
		<div className="bg-cover bg-center flex justify-center items-center min-h-screen">
			<div className="bg-black bg-opacity-80 text-white w-96 p-8 rounded-lg shadow-md mt-[-150px]">
				<h1 className="mb-2 text-3xl text-center font-bold">Login</h1>
				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<div className="flex flex-col">
						<label className="mb-1">Email </label>
						<input
							className="border rounded px-2 py-1 bg-white text-black"
							name="email"
							type="email"
							id="email"
							autoComplete="email"
						/>
					</div>
					<div className="flex flex-col">
						<label className="mb-1">Password </label>
						<input
							className="border rounded px-2 py-1 bg-white text-black"
							name="password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
					</div>
					<button
						type="submit"
						className="background-gradient hover:bg-tq-accentfont-bold py-2 px-4 rounded"
					>
						Submit
					</button>
					{error && <div className="text-red-500 mb-4" id="error_msg">{error}</div>} {/* Display error message */}
					<div className="text-center mt-4">
						Don't have an account?<br />
						<Link href={"/registration"} className="text-white-500 hover:underline">Sign up here</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
