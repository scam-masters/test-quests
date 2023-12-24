"use client"
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";

import { getMissionList } from '@/app/actions';
import { getUserData, getUserScoreForMission } from '@/app/user_actions';
import CircleMission from '@/components/button/circle_mission';

function Landing() {
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
    async function retrieveMissions() {
        const userInfo = await getUserData()
        const missions = await getMissionList() //  Retrieve the list of missions from the database
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

    function lockedMission(missionId) {
        return (
            <div key={missionId} className='text-center m-5 align-middle' onClick={MissionLocked}>
                <CircleMission type="locked">Mission Locked</CircleMission>
            </div>
        )
    }

    async function unlockedMission(missionId, missionData) {
        const userScore = await getUserScoreForMission(missionId);
        return (
            <div key={missionId} className='text-center m-5 align-middle'>
                <Link href={missionData.learning.learningLink}>
                    <CircleMission type="gradient" userScore={userScore} maxPoints={missionData.points}>
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
                retrieveMissions().then(newMissions => {
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
        </div>
    );
}

export default Landing;
