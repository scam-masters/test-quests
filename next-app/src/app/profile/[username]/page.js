"use server"
import React from 'react';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

// TODO: to implement
import ProfileView from '@/components/profileView/view'

// TODO: to implement
import { getProfileData } from "@/app/actions"

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
export default async function Profile({ params }) {
    // get the profile of the user
    const profileContent = await getProfileData(params.username);
    // TODO: properly handle if profile is not found
    // if (!profileContent) {
    //     return <div>Profile not found</div>;
    // }
    

    let isOwner = false; // TODO: check if the user is the owner of the profile

    let profileArgs = {
        owner: isOwner,
        email: profileContent.email,
        avatar: profileContent.avatar,
        badges: profileContent.badges,
        username: profileContent.username,
        score: profileContent.score
    }

    return (
        <div>
            {/* Use the LearningComponent with mission-specific content */}
            <ProfileView
                owner={profileArgs.owner}
                email={profileArgs.email}
                avatar={profileArgs.avatar}
                badges={profileArgs.badges}
                username={profileArgs.username}
                score={profileArgs.score}
            />
        </div>
    );
}
