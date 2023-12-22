"use client";
import React, { useState } from "react";

import { registerUser } from "@/app/actions"


function Registration() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [error, setError] = useState(null); // State for managing error messages


	const handleSubmit = async (event) => {
		event.preventDefault();

		const error = registerUser(email, password, username);
		if (error)
			setError(error)
	};

	return (
		<div className="bg-cover bg-center flex justify-center items-center min-h-screen">
			<div className="bg-black bg-opacity-80 text-white w-96 p-8 rounded-lg shadow-md mt-[-150px]">
				<h1 className="mb-2 text-3xl text-center font-bold">Registration</h1>
				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<label className="flex flex-col text white">
						<span className="mb-1">Username:</span>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="border rounded px-2 py-1 text-black"
						//required
						/>
					</label>
					<label className="flex flex-col text white">
						<span className="mb-1">Email:</span>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border rounded px-2 py-1 text-black"
						//required
						/>
					</label>
					<label className="flex flex-col text-white">
						<span className="mb-1">Password:</span>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="border rounded px-2 py-1 text-black"
							//required
							minLength="6"
						/>
					</label>
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
