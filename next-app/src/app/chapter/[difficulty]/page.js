"use client"
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";
import Button from '@/components/button/button';

import { getMissionList } from '@/app/actions';
import { getUserData, getUserScoreForMission } from '@/app/user_actions';
import CircleMission from '@/components/button/circle_mission';

import { getMissionsByDifficulty } from "@/app/actions"

// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
export default function Chapter({ params }) {
    // Get the current mission
    const router = useRouter()
    const [visible_dialog, setVisibleDialog] = useState(false);
    const [missions, setMissions] = useState([])

    function MissionLocked() {
        return (
            setVisibleDialog(true)
        )
    }

    function handleCloseDialog() {
        return (
            setVisibleDialog(false)
        )
    }

    // ******************* Retrieve missions and user progress ******************* //
    async function retrieveMissions(difficultyLevel) {
        const userInfo = await getUserData()
        const missions =  await getMissionsByDifficulty(difficultyLevel) //  Retrieve the list of missions by difficulty level from the database
        const result = []

        // For each mission, check if it is included in the user progress
        // If so, show the mission as unlocked, otherwise show it locked
        for (let m in missions) {
            if (missions[m].id in userInfo.missions)
                result.push(await unlockedMission(missions[m].id, missions[m].data))
            else
                result.push(lockedMission(missions[m].id))
        }
        return result
    }

    function getTranslation(missionNum) {
        const alignNum = missionNum % 8
        let alignment = ""
        if (alignNum == 1 || alignNum == 5) {
            // do nothing
        } else if (alignNum == 2 || alignNum == 4) {
            alignment = "translate-x-[110%]"
        } else if (alignNum == 3) {
            alignment = "translate-x-[150%]"
        } else if (alignNum == 6 || alignNum == 8) {
            alignment = "-translate-x-[110%]"
        } else if (alignNum == 7) {
            alignment = "-translate-x-[150%]"
        }
        return alignment
    }

    function lockedMission(missionId) {
        const missionNum = missionId.split("_")[1]
        const translation = getTranslation(missionNum)

        return (
            <div key={missionId} className='text-center m-5 align-middle' onClick={MissionLocked}>
                <CircleMission className={translation} type="locked">Mission Locked</CircleMission>
            </div>
        )
    }

    async function unlockedMission(missionId, missionData) {
        const userScore = await getUserScoreForMission(missionId);
        const missionNum = missionId.split("_")[1]
        const translation = getTranslation(missionNum)

        return (
            <div key={missionId} className='text-center m-5 align-middle'>
                <Link href={missionData.learning.learningLink}>
                    <CircleMission className={translation} type={"gradient-"+(missionNum%3 || 1)} userScore={userScore} maxPoints={missionData.points}>
                        {missionData.name}
                    </CircleMission>
                </Link>
            </div>
        )
    }

    useEffect(() => {
        /* when logged in show missions, otherwise go to login page */
        getAuth().onAuthStateChanged(function (user) {
            if (user) {
                retrieveMissions(`${params.difficulty}`).then(newMissions => {
                    setMissions(newMissions)
                })
            } else
                router.push("/Login")
        });
    }, []);

    return (
        <div className='p-10'>

            {missions}

            <Dialog
                className='bg-tq-black text-tq-white w-1/2 h-auto'
                header="Mission Locked"
                visible={visible_dialog}
                onHide={handleCloseDialog}
            >
                <p>Please complete previous missions to access this one</p>
            </Dialog>

            {/* "Go back to main page" button */}
            <div className="fixed bottom-0 p-5 left-0 mb-5 z-50">
                <Link href="/">
                    <Button type='blue' id="back_to_main">
                        Go back to main page
                    </Button>
                </Link>
            </div>
        </div>
    );
    
}
