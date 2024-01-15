"use client"

import { db, app } from "@/firebase/index";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function getUserData() {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.email);
    const document = await getDoc(docRef);
    return document.data()
}

export async function setUserData(userData) {
    const auth = getAuth();
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.email);
    await setDoc(docRef, userData, { merge: true });
}

export async function updateInitialScore() {
    await getUserData().then(userData => {
        if (userData.score == -1) {
            userData.score = 0
            setUserData(userData)
        }
    })
}

/* updates the user's data when the solution a mission is successfully submitted */
export async function updateUserScore(missionId, missionScore) {
    await getUserData().then(userData => {
        // every submission that scores strictly more that the previous one, updates the timestamp.
        if (missionScore > userData.missions[missionId].score) {
            // update mission data (relative to the user)
            userData.missions[missionId].score = missionScore
            userData.missions[missionId].timestamp = Date.now()

            // update user general score
            userData.score = Math.max(userData.score, 0) + missionScore

            // unlock the next mission
            const missionNumber = missionId.split("_")[1]
            const nextMissionId = "mission_" + (parseInt(missionNumber) + 1).toString()
            userData.missions[nextMissionId] = { id: nextMissionId, score: -1 }
            setUserData(userData)
        }
    })
}

/* returns the score for the mission missionId from the database */
export async function getUserScoreForMission(missionId) {
    const userData = await getUserData()
    return userData.missions[missionId].score
}
