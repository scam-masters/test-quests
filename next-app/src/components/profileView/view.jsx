'use client';
import React, { useState, useEffect } from "react";
import Button from "@/components/button/button";
import { getAuth } from "firebase/auth";
import { addFriendRequest, acceptFriendRequest, declineFriendRequest, getUserData, getAvatarByUsername } from "@/app/user_actions.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faBell, faCheck, faTimes, faMedal } from '@fortawesome/free-solid-svg-icons'
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
        // get user from getAuth(data)
        const user = await getUserData();
        return user.username;
    };

    const fetchAvatars = async () => {
        // map each friend with its avatar
        const avatarMap = {};
        for (const friend of friendsList) {
            const avatar = await getAvatarByUsername(friend);
            avatarMap[friend] = avatar;
        }
        // map each user inside the friend requests list with its avatar
        for (const friend of friendRequestsList) {
            const avatar = await getAvatarByUsername(friend);
            avatarMap[friend] = avatar;
        }
        setAvatars(avatarMap);
    };

    useEffect(() => {
        getAuth().onAuthStateChanged(function (user) {
            if (user) {
                // set if the owner of the page is the current logged user
                setIsOwner(user.email === email);
                getUsername().then((username) => {
                    // check the owner of the pahpage is a friend, stranger or has a request of the current logged user
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
        // add the current user to the friend requests of the owner of the page
        addFriendRequest(username).then(() => {
            setStatus('request');
        }).catch(error => {
            setErrorMessage(error.message);
        });
    };

    function handleAccept(senderUsername) {
        // accept the friend request of the sender
        acceptFriendRequest(senderUsername).then(() => {
            setFriendRequestsList(friendRequestsList.filter(request => request !== senderUsername));
            setFriendsList([...friendsList, senderUsername]);
        }).catch(error => {
            setErrorMessage(error.message);
        });
    };

    function handleDecline(senderUsername) {
        // decline the friend request of the sender
        declineFriendRequest(senderUsername).then(() => {
            setFriendRequestsList(friendRequestsList.filter(request => request !== senderUsername));
        }).catch(error => {
            setErrorMessage(error.message);
        });
    };


    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-row p-4 justify-center flex-wrap">
                <div className="flex flex-col items-center justify-center">
                    <img src={`/avatars/${avatar}.png`} alt={`avatar${avatar}`} className="rounded-full m-3 w-40 h-40 border-2 border-white" />
                    {isOwner && <Button id="change-avatar" type='blue' href="/changeAvatar">Change Avatar</Button>}
                </div>

                <div className="flex flex-col ml-5 mt-auto mb-auto flex-wrap pt-8">
                    <h1 id="username" className="text-5xl font-bold mr-8">{username}</h1>
                    {isOwner && <p id="email" className="text-lg mt-4">Email: {email}</p>}
                    <p id="score" className="text-lg mt-4">Score: {score}</p>

                    <div className="flex flex-row items-center flex-wrap pt-4">
                        {isOwner && <Button id="change-username" type='blue' href="/changeUsername">Change Username</Button>}
                        {isOwner && <Button id="logout" type='blue' classNames="mx-4" onClick={() => {
                            auth.signOut();
                            router.push("/login")
                        }}>Logout</Button>}
                    </div>

                    {isOwner ? <></> : (
                        <>
                            {status === 'friend' ? (<Button classNames="my-4 max-w-xs w-[400px]" type='green'>Mutual friends</Button>) : null}
                            {status === 'request' ? (<Button classNames="my-4 max-w-xs w-[400px]" type='green'>Request sent</Button>) : null}
                            {/* if is a stranger, show the add friend button */}
                            {status === 'stranger' ? (<Button classNames="my-4 max-w-xs w-[400px]" type='blue' onClick={handleAddFriend} id="add_friend">Add Friend</Button>) : null}
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col p-3 space-y-4 w-full max-w-2xl m-auto">

                <h2 className="text-3xl font-bold m-auto">
                    {/* include a medal icon */}
                    <FontAwesomeIcon icon={faMedal} className="mr-2 max-w-[50px]" />
                    Badges
                </h2>

                <div className="flex flex-row flex-wrap pb-5 justify-center">
                    {badges.length != 0 ? badges.map((badge, index) => (
                        <ul role="list">
                            <li className="group/item pb-4">
                                <img key={index} src={`/badges/${badge}.png`} alt={`badge${badge}`} className="w-14 h-14 mr-2 mt-4 group index" />
                                <div class="group/edit invisible group-hover/item:visible pt-2">
                                    <div className="absolute bg-tq-white text-black p-2 rounded-lg shadow-md">
                                        {/* make the badge name more readable when hover */}
                                        {badge.replace(/_/g, " ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    ))
                        // if the user doesn't have any badge, check if is the owner of the page and show a message
                        :
                        isOwner ? <p className="text-lg">Complete missions to earn badges!</p> : <p className="text-lg">No badges found.</p>
                    }
                </div>

                <h2 className="text-3xl font-bold m-auto">
                    {/* include a user icon */}
                    <FontAwesomeIcon icon={faUsers} className="mr-2 max-w-[50px]" />
                    Friends
                </h2>

                {isOwner ? <Button id="find-friends" classNames="flex max-w-sm m-auto justify-center" type="blue" href="/searchPlayers">Find Friends</Button> : <></>}
                {friendsList.length > 0 ? (
                    <ul>
                        {friendsList.map((friend, index) => (
                            <li key={`f_${index}_${friend}`} className="flex items-center mb-2 ">
                                <a href={`/profile/${friend}`} className="flex items-center hover:text-blue-500 hover:underline">
                                    {/* get the avatar of the friend using the mapping created by fetchAvatars */}
                                    {avatars[friend] !== undefined && <img src={`/avatars/${avatars[friend]}.png`} alt={`avatar`} className="rounded-full w-16 h-16 mr-2" />}
                                    <span className="text-xl px-2">{friend}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-lg">No friends found</p>
                )}
                {/* show the friend requests only if the owner of the page is the current logged user */}
                {isOwner ?
                    (<>
                        <h2 className="text-3xl font-bold m-auto mb-4">
                            {/* include a bell icon */}
                            <FontAwesomeIcon icon={faBell} className="mr-2 max-w-[50px]" />
                            Friend Requests
                        </h2>
                        {friendRequestsList.length > 0 ? (
                            <ul>
                                {friendRequestsList.map((friend, index) => (
                                    <li key={`fr_${index}_${friend}`} className="flex items-center justify-between mb-2 ">
                                        <a href={`/profile/${friend}`} className="flex items-center hover:text-blue-500 hover:underline">
                                            {/* again get the avatar of the friend using the mapping created by fetchAvatars */}
                                            {avatars[friend] !== undefined && <img src={`/avatars/${avatars[friend]}.png`} alt={`avatar`} className="rounded-full w-16 h-16 mr-2" />}
                                            <span className="text-xl px-2">{friend}</span>
                                        </a>
                                        <div className="ml-3">
                                            <Button classNames="mx-1" type="green" onClick={() => { handleAccept(friend) }}><FontAwesomeIcon icon={faCheck} /></Button>
                                            <Button classNames="mx-1" type="red" onClick={() => { handleDecline(friend) }}><FontAwesomeIcon icon={faTimes} /></Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-lg">No friend requests found.</p>
                        )}
                    </>) :
                    <></>
                }
            </div>
        </div >
    );
}