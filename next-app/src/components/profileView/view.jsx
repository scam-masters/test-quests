'use client';
import React, { useState, useEffect } from "react";
import Button from "@/components/button/button";
import { getAuth } from "firebase/auth";
import { addFriendRequest } from "@/app/user_actions.js"

export default function ProfileView({ email, avatar, badges, username, friends, friendRequests, score }) {

    const [isOwner, setIsOwner] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        getAuth().onAuthStateChanged(function (user) {
            if (user) {
                setIsOwner(user.email === email);
            } else {
                setIsOwner(false);
            }
        });
    }, []);

    const handleAddFriend = () => {
        addFriendRequest(username)
            .catch(error => {
                setErrorMessage(error.message);
            });
    };
    
    return (
        <div className="flex flex-row tems-center justify-center m-auto p-4">
            <div className="flex flex-col items-center justify-center">
                <img src={`/avatars/${avatar}.png`} alt={`avatar${avatar}`} className="rounded-full m-3 w-40 h-40 border-2 border-white" />

                {isOwner && <Button type='blue' href="/changeAvatar">Change Avatar</Button>}
            </div>

            <div className="ml-5 mt-auto mb-auto">
                <div className="flex flex-row items-center">

                    <h1 className="text-5xl font-bold mr-8">{username}</h1>
                    {isOwner && <Button type='blue' href="/changeUsername">Change Username</Button>}
                
                </div>
                {isOwner && <p className="text-xl mt-4">Email: {email}</p>}

                <p className="text-xl mt-4">Score: {score}</p>

                <div className="flex flex-row ">
                    {badges.map((badge, index) => (
                        <img title={badge.replace("_", " ")} key={index} src={`/badges/${badge}.png`} alt={`badge${badge}`} className="w-10 h-10 mr-2 mt-4" />
                    ))}
                </div>
            </div>

            <div className="ml-5 mt-auto mb-auto">
                <h2 className="text-3xl font-bold">Friends</h2>
                <ul>
                    {friends.map((friend, index) => (
                        <li key={index}>{friend}</li>
                    ))}
                </ul>
                {isOwner ? 
                    (<>  
                        <h2 className="text-3xl font-bold">Friend Requests</h2>
                        <ul>
                            {friendRequests.map((friend, index) => (
                                <li key={index}>{friend}</li>
                            ))}
                        </ul>
                    </>):
                    (
                        <>
                            <Button type='blue' onClick={handleAddFriend} id="add_friend">Add Friend</Button>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                        </>
                    )
                }
            </div>
        </div>
    );
}