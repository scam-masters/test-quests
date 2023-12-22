"use client"
import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { getExerciseData } from '@/app/actions';
import CircleMission from '@/components/button/circle_mission';
import { db } from "@/firebase/index";

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

    // TODO: probably this function will be useful also somewhere else, put it in a common file
    async function getUserData() {
        const auth = getAuth();
        const user = auth.currentUser;
        const docRef = doc(db, "users", user.email);
        const document = await getDoc(docRef);
        return document.data()
    }

    // ******************* Retrieve missions and user progress ******************* //
    async function retrieveMissions() {
        const userInfo = await getUserData()
        const missions = userInfo.missions
        const result = []
        for (let m in missions) {
            if (missions[m].score === -1)
                result.push(lockedMission(missions[m].id))
            else
                result.push(await unlockedMission(missions[m].id))
        }
        return result
    }

    function lockedMission(missionId) {
        return (
            <div key={missionId} className='text-center mt-5 mb-2.5 align-middle' onClick={MissionLocked}>
                <CircleMission type="locked">Mission Locked</CircleMission>
            </div>
        )
    }

    async function unlockedMission(missionId) {
        const missionData = await getExerciseData(missionId)
        return (
            <div key={missionId} className='text-center relative align-middle'>
                <Link href={missionData.learning.learningLink}>
                    <CircleMission type="gradient">
                        {missionData.name}
                    </CircleMission>
                </Link>
            </div>
        )
    }

    useEffect(() => {
        /* when logged in show missions, otherwise go to login page */
        getAuth().onAuthStateChanged(function(user) {
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
