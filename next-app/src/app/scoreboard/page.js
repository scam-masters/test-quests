"use client"
import React, { useEffect, useState } from 'react';
import ScoreboardComponent from '@/components/Scoreboard/scoreboard'

import { getScoreboardData } from "@/app/user_actions"

export default function Scoreboard() {
    // scoreboardContent returns an array of couples (name, score)
    const [scoreboardContent, setScoreboardContent] = useState([]);
    useEffect(() => {
        getScoreboardData().then(setScoreboardContent)
    }, [])
    return (
        <div>
            {/* Use the ScoreboardComponent with data retrieved from backend */}
            <ScoreboardComponent scoreboardData={scoreboardContent} />
        </div>
    );
}
