"use client";

import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase/index";
import { useRouter } from "next/navigation";
// import { setNewAvatar } from "@/app/user_actions";


function ImageDropdown({ images }) {
    const [selectedImage, setSelectedImage] = useState(images[0]);
  
    return (
      <div className="relative inline-block text-left">
        <div>
          <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" aria-expanded="true">
            <img src={selectedImage.src} alt={selectedImage.alt} className="h-6 w-6 rounded-full" />
          </button>
        </div>
  
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {images.map((image, index) => (
              <button key={index} onClick={() => setSelectedImage(image)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                <img src={image.src} alt={image.alt} className="h-6 w-6 rounded-full" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
}


export default function changeUsername() {
    const allAvatars = [
        { src: '/avatars/1.png', alt: 'Avatar 1' },
        { src: '/avatars/2.png', alt: 'Avatar 2' },
        { src: '/avatars/3.png', alt: 'Avatar 3' },
      ];

	const router = useRouter()
	const [error, setError] = useState(null); // State for managing error messages

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError(null)

		const formData = new FormData(event.target)
		const newAvatar = formData.get("avatar")

		try {
			// await setNewAvatar(getAuth(app), newAvatar)
			router.push("/") // TODO: redirect to your profile instead
		} catch (error) {
            setError(error.message)
		}
	};

	return (
		<div className="bg-cover bg-center flex justify-center items-center min-h-screen">
			<div className="bg-black bg-opacity-80 text-white w-96 p-8 rounded-lg shadow-md mt-[-150px]">
				<h1 className="mb-2 text-3xl text-center font-bold">Login</h1>
				<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
					<div className="flex flex-col">
						<label className="mb-1">New Username</label>
                        <ImageDropdown images={allAvatars} />
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
