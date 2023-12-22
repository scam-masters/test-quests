"use client"
import React, { useState } from 'react';
import CircleMission from '@/components/button/circle_mission';
import { Dialog } from 'primereact/dialog';
import { getUserData, getExerciseData } from '@/app/actions';
import Link from 'next/link';

function Landing() {

    const [visible_dialog, setVisibleDialog] = useState(false);

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
    function retrieveMissions() {
        const userInfo = getUserData()
        const missions = userInfo.missions
        for (const m in missions) {
            if (missions[m].score === -1)
                return lockedMission()
            else
                return unlockedMission(missions[m].id)
        }
    }

    function lockedMission() {
        return (
            <div className='text-center mt-5 mb-2.5 align-middle' onClick={MissionLocked}>
                <CircleMission type="locked">Mission Locked</CircleMission>
            </div>
        )
    }

    function unlockedMission(missionId) {
        missionData = getExerciseData(missionId)
        return (
            <div className='text-center relative align-middle'>
                <Link href={missionData.learning.learningLink}>
                    <CircleMission type="gradient">
                        missionData.name
                    </CircleMission>
                </Link>
            </div>
        )
    }

    return (
        <div className='p-10'>

            {retrieveMissions()}

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
