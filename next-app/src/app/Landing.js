"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth } from "firebase/auth";

import { getStorylineList } from '@/app/actions';
import CircleMission from '@/components/button/circle_mission';

export default function Landing() {
    const router = useRouter()
    const [storylines, setStorylines] = useState([])

    // ******************* Retrieve storylines and user progress ******************* //
    async function retrieveStorylines() {
        const storylines = await getStorylineList()
        return DisplayStorylines(storylines);
    }

    function DisplayStorylines(storylines) {

        return (
            <div>
                {storylines.map((storyline, index) => (
                    <div key={`${storyline}_${index}`} className='text-center m-5 align-middle'>
                        <Link href={`/storyline/${storyline}`} id={`storyline_${index}`}>
                            <CircleMission type={'gradient-' + (index % 3)}>
                                {storyline.charAt(0).toUpperCase() + storyline.slice(1)}
                            </CircleMission>
                        </Link>
                    </div>
                ))}
            </div>
        );
    }

    useEffect(() => {
        /* when logged in show storylines, otherwise go to login page */
        getAuth().onAuthStateChanged(function (user) {
            if (user) {
                retrieveStorylines().then(newStorylines => {
                    setStorylines(newStorylines)
                })
            } else
                router.push("/Login")
        });
    }, []);

    return (
        <div className='p-10'>
            {storylines}
        </div>
    );
}
