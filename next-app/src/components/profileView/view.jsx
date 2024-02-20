'use client';
import React, { useState, useEffect } from "react";
import Button from "@/components/button/button";
import { getAuth } from "firebase/auth";
import { addFriendRequest, acceptFriendRequest, declineFriendRequest, getUserData, getAvatarByUsername } from "@/app/user_actions.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faBell, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { app } from "@/firebase/index";
import { useRouter } from "next/navigation";

const auth = getAuth(app);

export default function ProfileView({ email, avatar, badges, username, friends, friendRequests, score }) {
    
    const router = useRouter();
    const [isOwner, setIsOwner] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [friendsList, setFriendsList] = useState(friends);
    const [friendRequestsList, setFriendRequestsList] = useState(friendRequests);
    const [status, setStatus] = useState(''); // friend, request, stranger
    const [avatars, setAvatars] = useState({})

    const getUsername = async () => {
        const user = await getUserData();
        return user.username;
    };

    const fetchAvatars = async () => {
        const avatarMap = {};
        for (const friend of friendsList) {
            const avatar = await getAvatarByUsername(friend);
            avatarMap[friend] = avatar;
        }
        for (const friend of friendRequestsList) {
            const avatar = await getAvatarByUsername(friend);
            avatarMap[friend] = avatar;
        }
        setAvatars(avatarMap);
    };

    useEffect(() => {
        getAuth().onAuthStateChanged(function (user) {
            if (user) {
                setIsOwner(user.email === email);
                getUsername().then((username) => {
                    if (friendsList.includes(username)) {
                        setStatus('friend');
                    } else if (friendRequestsList.includes(username)) {
                        setStatus('request');
                    } else {
                        setStatus('stranger');
                    }
                });
            } else {
                setIsOwner(false);
            }
        });
        fetchAvatars()
    }, []);

    const handleAddFriend = () => {
        addFriendRequest(username).then(() => {
            setStatus('request');
        }).catch(error => {
            setErrorMessage(error.message);
        });
    };

    function handleAccept(senderUsername) {
        acceptFriendRequest(senderUsername).then(() => {
            setFriendRequestsList(friendRequestsList.filter(request => request !== senderUsername));
            setFriendsList([...friendsList, senderUsername]);
        }).catch(error => {
            setErrorMessage(error.message);
        });
    };

    function handleDecline(senderUsername) {
        declineFriendRequest(senderUsername).then(() => {
            setFriendRequestsList(friendRequestsList.filter(request => request !== senderUsername));
        }).catch(error => {
            setErrorMessage(error.message);
        });
    };


    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex w-8/12 justify-center">
                <div className="w-10/12 max-w-10/12 min-h-[30vh] justify-center">
                    <div className="flex flex-row p-4 justify-center">
                        <div className="flex flex-col items-center justify-center">
                            <img src={`/avatars/${avatar}.png`} alt={`avatar${avatar}`} className="rounded-full m-3 w-40 h-40 border-2 border-white" />

                            {isOwner && <Button type='blue' href="/changeAvatar">Change Avatar</Button>}
                        </div>

                        <div className="ml-5 mt-auto mb-auto">
                            <div className="flex flex-row items-center">

                                <h1 className="text-5xl font-bold mr-8">{username}</h1>
                                {isOwner && <Button type='blue' href="/changeUsername">Change Username</Button>}
                                {isOwner && <Button type='blue' onClick={() => {
                                    auth.signOut();
                                    router.push("/Login")
                                }}>Logout</Button>}

                            </div>
                            {isOwner && <p className="text-xl mt-4">Email: {email}</p>}

                            <p className="text-xl mt-4">Score: {score}</p>

                            <div className="flex flex-row ">
                                {badges.map((badge, index) => (
                                    <img title={badge.replace(/_/g, " ")} key={index} src={`/badges/${badge}.png`} alt={`badge${badge}`} className="w-10 h-10 mr-2 mt-4" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {
                        isOwner ? null : (
                            <div className="flex justify-center p-4 flex-col">
                                {
                                    status === 'friend' ? (<Button type='green'>Mutual friends</Button>) : null
                                }
                                {
                                    status === 'request' ? (<Button type='green'>Request sent</Button>) : null
                                }
                                {
                                    status === 'stranger' ? (<Button type='blue' onClick={handleAddFriend} id="add_friend">Add Friend</Button>) : null
                                }
                                {errorMessage && <div className="error-message">{errorMessage}</div>}
                            </div>
                        )
                    }
            </div>
        </div>

            <div className="flex w-7/12 justify-center">
                <div className="w-1/2 max-w-1/2 p-3 min-h-[10vh]">
                    <h2 className="text-3xl font-bold m-auto mb-4">
                        <FontAwesomeIcon icon={faUsers} className="mr-2 max-w-[50px]" />
                        Friends
                    </h2>
                    <div className="flex">
                        {friendsList.length > 0 ? (
                            <ul>
                                {friendsList.map((friend, index) => (
                                    <li key={`f_${index}_${friend}`} className="flex items-center mb-2 ">
                                        <a href={`/profile/${friend}`} className="flex items-center hover:text-blue-500 hover:underline">
                                            {avatars[friend] !== undefined && <img src={`/avatars/${avatars[friend]}.png`} alt={`avatar`} className="rounded-full w-16 h-16 mr-2" />}
                                            <span className="text-xl px-2">{friend}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No friends found.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex w-7/12 justify-center">
                {isOwner ?
                    (<>
                        <div className="w-1/2 max-w-1/2 p-3 min-h-[10vh]">
                            <h2 className="text-3xl font-bold mb-4">
                                <FontAwesomeIcon icon={faBell} className="mr-2 max-w-[50px]" />
                                Friend Requests
                            </h2>
                            <div className="flex">
                                {friendRequestsList.length > 0 ? (
                                    <ul>
                                        {friendRequestsList.map((friend, index) => (
                                            <li key={`fr_${index}_${friend}`} className="flex items-center justify-between mb-2 ">
                                                <a href={`/profile/${friend}`} className="flex items-center hover:text-blue-500 hover:underline">
                                                    {avatars[friend] !== undefined && <img src={`/avatars/${avatars[friend]}.png`} alt={`avatar`} className="rounded-full w-16 h-16 mr-2" />}
                                                    <span className="text-xl px-2">{friend}</span>
                                                </a>
                                                <div className="ml-3">
                                                    <Button classNames="mx-1" type="green" onClick={() => { handleAccept(friend) }}><FontAwesomeIcon icon={faCheck}/></Button>
                                                    <Button classNames="mx-1" type="red" onClick={() => { handleDecline(friend) }}><FontAwesomeIcon icon={faTimes}/></Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No friend requests found.</p>
                                )}
                            </div>
                        </div>
                    </>) :
                    (null)
                }
            </div>
        </div>
    );
}