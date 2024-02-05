'use client';
import React, { useState, useEffect } from "react";
import Button from "@/components/button/button";
import { getAuth } from "firebase/auth";

// import { updateAvatar, updateUsername } from "@/app/user_actions.js"
// import { Dialog } from "primereact/dialog";

export default function ProfileView({ email, avatar, badges, username, score}) {

	const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        getAuth().onAuthStateChanged(function (user) {
			if (user) {
				setIsOwner(user.email === email);
			} else {
				setIsOwner(false);
			}
		});
	}, []);

    return (
        <>
            <div className="flex flex-row items-center">
                <img src={`/avatars/${avatar}.png`} alt={`avatar${avatar}`} className="w-20 h-20 rounded-full m-4" />
                {isOwner ? <Button text="Change avatar"/> : ""}

                <div className="ml-4">
                    <h1 className="text-3xl font-bold text-blue-700">{username}</h1>
                    {isOwner ? <Button text="Change username"/> : ""}

                    {isOwner ? <p className="text-xl text-gray-600">{email}</p>: ""}

                    <p className="text-xl text-gray-600">{score}</p>

                    <div className="flex flex-row mt-4">
                        {badges.map((badge, index) => {
                            return (
                                <img key={index} src={`/badges/${badge}.png`} alt={`badge${badge}`} className="w-10 h-10 mr-2" />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}