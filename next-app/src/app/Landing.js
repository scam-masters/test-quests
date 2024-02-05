"use client"
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";

import { getMissionList } from '@/app/actions';
import { getUserData, getUserScoreForMission } from '@/app/user_actions';
import CircleMission from '@/components/button/circle_mission';
import Hotjar from '@hotjar/browser';

export default function Landing() {
    const router = useRouter()
    const [visible_dialog, setVisibleDialog] = useState(false);
    const [chapters, setChapters] = useState([])
    const siteId = 3847955;
    const hotjarVersion = 6;

    function ChapterLocked() {
        return (
            setVisibleDialog(true)
        )
    }

    function handleCloseDialog() {
        return (
            setVisibleDialog(false)
        )
    }

    // ******************* Retrieve chapters and user progress ******************* //
    async function retrieveChapters() {
        // retrieve all the list to check the progress of the user in the mission
        // to display correclty chapters (watch line 43 for possible improvement)
        const userInfo = await getUserData()
        const missions = await getMissionList() //  Retrieve the list of missions from the database

        // For each mission, check if it is included in the user progress
        // If so, let's extract the difficulty of the mission performed 
        // by the user in order to understand which chapter display
        let counter = 0;

        for (let m in missions) { 
            // TODO: change this checking only the difficulty of the last mission 
            // performed by the user to avoid checking all the missions
            if (missions[m].id in userInfo.missions) {
                // check for the difficulty
                if (missions[m].data.difficulty == "easy") counter = 1;
                else if (missions[m].data.difficulty == "medium") counter = 2;
                else if (missions[m].data.difficulty == "hard") counter = 3;
            }
        }
        return DisplayChapters(counter);
    }

    function DisplayChapters(counter) {
        // Assuming chapters is an array of chapter objects
        const chapters = [
            { id: 1, title: "Chapter 1", chapterLink: "/chapter/easy"},
            { id: 2, title: "Chapter 2", chapterLink: "/chapter/medium" },
            { id: 3, title: "Chapter 3", chapterLink: "/chapter/hard" },
        ];

        return (
            <div>
                {chapters.map((chapter, index) => (
                    <div key={chapter.id} className='text-center m-5 align-middle'>
                        {index < counter ? (
                            <Link href={chapter.chapterLink}>
                                <CircleMission type={'gradient-'+(chapter.id%3)}>
                                    {chapter.title}
                                </CircleMission>
                            </Link>
                        ) : (
                            <div onClick={ChapterLocked}>
                                <CircleMission type="locked">
                                    {chapter.title}
                                </CircleMission>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    useEffect(() => {
        Hotjar.init(siteId, hotjarVersion);  // check this https://insights.hotjar.com/sites/3847955/setup?step=npm
        /* when logged in show missions, otherwise go to login page */
        console.log(Hotjar.isReady())
        getAuth().onAuthStateChanged(function (user) {
            if (user) {
                retrieveChapters().then(newChapters => {
                    setChapters(newChapters)
                })
            } else
                router.push("/Login")
        });
    }, []);

    return (
        <div className='p-10'>

            {chapters}

            <Dialog
                className='bg-tq-black text-tq-white w-1/2 h-auto'
                header="Chapter Locked"
                visible={visible_dialog}
                onHide={handleCloseDialog}
            >
                <p>Please complete previous chapter's missions to access this chapter</p>
            </Dialog>
        </div>
    );
}
