"use server"

import React from 'react';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { getProfileData } from "@/app/actions"

import ProfileView from '@/components/profileView/view'


// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
export default async function Profile({ params }) {

    const profileContent = await getProfileData(params.username);
   
    // TODO: properly handle if profile is not found
    // if (!profileContent) {
    //     return <div>Profile not found</div>;
    // }
    
    let profileArgs = {
        email: profileContent.email,
        avatar: profileContent.avatar,
        badges: profileContent.badges,
        username: profileContent.username,
        score: profileContent.score
    }

    return (
        <div>
            <ProfileView
                email={profileArgs.email}
                avatar={profileArgs.avatar}
                badges={profileArgs.badges}
                username={profileArgs.username}
                score={profileArgs.score}
            />
        </div>
    );
}
