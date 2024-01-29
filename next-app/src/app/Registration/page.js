"use client";
import React, { useState } from "react";

import { registerUser } from "@/app/actions"
import { useRouter }  from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/firebase/index";


function Registration() {
	const router = useRouter()
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState(null); // State for managing error messages


	const handleSubmit = async (event) => {
		event.preventDefault();

		// add the auth to recognize the emulator
		const error = await registerUser(email, password, username);
		
		if (error)
			setError(error);
		else {
			// if the registration was successful, login and redirect to the home page
			await signInWithEmailAndPassword(getAuth(app), email, password);
			router.push("/");
		}
	};

	return (
		<div className="bg-cover bg-center flex justify-center items-center min-h-screen">
			<div className="bg-black bg-opacity-80 text-white w-96 p-8 rounded-lg shadow-md mt-[-150px]">
				<h1 className="mb-2 text-3xl text-center font-bold">Registration</h1>
				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<div className="flex flex-col text white">
						<label className="mb-1">Username </label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="border rounded px-2 py-1 text-black"
							required
						/>
					</div>
					<div className="flex flex-col text white">
						<label className="mb-1">Email </label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border rounded px-2 py-1 text-black"
							required
						/>
					</div>
					<div className="flex flex-col text-white">
						<label className="mb-1">Password </label>
						<input
							type="password"
							id="new-password"
							autoComplete="new-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="border rounded px-2 py-1 text-black"
							required
							minLength="6"
						/>
					</div>
					<button
						type="submit"
						className="bg-tq-primary hover:bg-tq-accent text-white font-bold py-2 px-4 rounded"
					>
						Submit
					</button>
					{error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}
				</form>
			</div>
		</div>
	);
}

export default Registration;
