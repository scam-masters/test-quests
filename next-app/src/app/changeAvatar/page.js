"use client";

import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase/index";
import { useRouter } from "next/navigation";
import { setNewAvatar } from "@/app/user_actions";
import { getUserData } from "@/app/user_actions";
import { usernameStore } from "@/stores/store";

/**
 * Page for changing the avatar for the user.
 *
 * @returns {JSX.Element} The JSX element representing the changeAvatar page.
 */
export default function changeAvatar() {
	const allAvatars = [
		{ src: '/avatars/0.png', alt: 'Avatar 0' },
		{ src: '/avatars/1.png', alt: 'Avatar 1' },
		{ src: '/avatars/2.png', alt: 'Avatar 2' },
	];

	const username = usernameStore((state) => state.username);

	const router = useRouter()
	const [error, setError] = useState(null);
	const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);

	useEffect(() => {
		getAuth().onAuthStateChanged(function (user) {
			if (user) {
				getUserData().then(user => {
					setCurrentAvatarIndex(user.avatar);
				})
			} else {
				router.push("/Login")
			}
		});
	}, []);


	const handleSubmit = async () => {
		setError(null)
		const newAvatarIndex = currentAvatarIndex;
		try {
			await setNewAvatar(getAuth(app), newAvatarIndex)
			router.push(`/profile/${username}`)
		} catch (error) {
			setError(error.message)
		}
	};

	const handleNextAvatar = () => {
		setCurrentAvatarIndex((currentAvatarIndex + 1) % allAvatars.length);
	};

	const handlePreviousAvatar = () => {
		setCurrentAvatarIndex((currentAvatarIndex - 1 + allAvatars.length) % allAvatars.length);
	};

	return (
		<div className="flex mt-20 items-center">
			<div className="wrap w-full text-center">
				<div className="profile mx-auto w-11/12 max-w-md bg-gray-200 rounded-lg p-6 relative shadow-md">
					<h1 className="text-3xl font-bold">Change Avatar</h1>

					<div className="mt-10 avatar w-40 h-40 rounded-full border-2 border-white mx-auto relative overflow-hidden">
						<img src={allAvatars[currentAvatarIndex].src} id="avatar-image" className=" w-full h-auto" alt="Avatar Image"></img>
					</div>
					<div className="mt-10 flex justify-between w-5/6 mx-auto pb-4 text-gray-600">
						<button onClick={handlePreviousAvatar} className="bg-tq-primary hover:bg-tq-accentfont-bold rounded">
							&larr;
						</button>
						<button onClick={handleSubmit} className="bg-tq-primary hover:bg-tq-accentfont-bold rounded">
							Submit
						</button>
						<button onClick={handleNextAvatar} className="bg-tq-primary hover:bg-tq-accentfont-bold rounded">
							&rarr;
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
