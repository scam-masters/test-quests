"use server"
import React from 'react';
import ScoreboardComponent from '@/components/Scoreboard/scoreboard'

import { getScoreboardData } from "@/app/actions"

export default async function Scoreboard({ params }) {
    // scoreboardContent returns an array of couples (name, score)
    const scoreboardContent = await getScoreboardData();
    //console.log(scoreboardContent);
    return (
        <div>
            {/* Use the ScoreboardComponent with data retrieved from backend */}
            <ScoreboardComponent scoreboardData={scoreboardContent} />
        </div>
    );
}