"use client"

import React, { useEffect, useState } from 'react';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { getProfileData } from "@/app/actions"

import ProfileView from '@/components/profileView/view'
import Loading from "@/components/Loading";

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
/**
 * Renders the profile page for a user.
 * 
 * @param {Object} params - The parameters passed to the component.
 * @param {string} params.username - The username of the user.
 * @returns {JSX.Element} The JSX element representing the profile page.
 */
export default function Profile({ params }) {
    const [profileContent, setProfileContent] = useState(null)
    useEffect(() => {
        if (!profileContent)
            getProfileData(params.username).then(setProfileContent);
    })

    if (!profileContent) {
        return <Loading />;
    }

    let profileArgs = {
        email: profileContent.email,
        avatar: profileContent.avatar,
        badges: profileContent.badges,
        username: profileContent.username,
        score: profileContent.score,
        friends: profileContent.friends,
        friendRequests: profileContent.friend_requests
    }

    return (
        <div>
            <ProfileView
                email={profileArgs.email}
                avatar={profileArgs.avatar}
                badges={profileArgs.badges}
                username={profileArgs.username}
                friends={profileArgs.friends}
                friendRequests={profileArgs.friendRequests}
                score={profileArgs.score == -1 ? 0 : profileArgs.score} // if the score is -1, display 0
            />
        </div>
    );
}
