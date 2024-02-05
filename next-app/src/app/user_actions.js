"use client"
import { db as firestore, app, auth as firebaseAuth } from "@/firebase/index";
import { doc, getDoc, setDoc, getDocs, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, connectAuthEmulator } from "firebase/auth";

export async function getUserData() {
    const auth = getAuth();
    const user = auth.currentUser;
    //console.log(auth.currentUser);
    const docRef = doc(firestore, "users", user.email);
    const document = await getDoc(docRef);
    return document.data()
}

export async function setUserData(userData) {
    const auth = getAuth();
    const user = auth.currentUser;
    const docRef = doc(firestore, "users", user.email);
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
export async function updateUserScore(missionId, newMissionScore, correctness, threshold) {
    if (correctness < threshold) {
        await updateInitialScore() // TODO: check if needed
    }

    const userData = await getUserData()
    // every submission that scores strictly more that the previous one, updates the timestamp.
    if (newMissionScore > userData.missions[missionId].score) {
        // update user general score, substract the old mission score
        userData.score = Math.max(userData.score, 0) + newMissionScore - userData.missions[missionId].score

        // update mission data (relative to the user)
        userData.missions[missionId].score = newMissionScore
        userData.missions[missionId].timestamp = Date.now()

        // unlock the next mission only when we get max score
        if (correctness >= threshold) {
            const missionNumber = missionId.split("_")[1]
            const nextMissionId = "mission_" + (parseInt(missionNumber) + 1).toString()
            userData.missions[nextMissionId] = { id: nextMissionId, score: -1 }
        }
        setUserData(userData)
    }
}

/* returns the score for the mission missionId from the database */
export async function getUserScoreForMission(missionId) {
    const userData = await getUserData()
    return userData.missions[missionId].score
}

/* returns a boolean indicating if we need display a different popup message for the last mission of a chapter completion */
export async function updateChapterUnlocking(missionId) {
    // retrieve the mission id of the current and the next one
    const missionNumber = missionId.split("_")[1]
    const nextMissionId = "mission_" + (parseInt(missionNumber) + 1).toString()
    try {
        // retrieve the mission performed and the next one
        const missionRef = doc(firestore, 'exercises', missionId)
        /*** TODO: 
         * 			add logic for when the user have finished the last mission in the storyline
         *          because you can't retrieve the next missions (there aren't) 
         * ***/
        const nextMissionRef = doc(firestore, 'exercises', nextMissionId)

        const missionDoc = await getDoc(missionRef)
        const nextMissionDoc = await getDoc(nextMissionRef)

        // Check if the documents exist and have the 'difficulty' field
        if (missionDoc && nextMissionDoc && missionDoc.data().difficulty == nextMissionDoc.data().difficulty) {
            // The difficulties are the same
            console.log('Difficulties are the same:', missionDoc.data().difficulty)
            return false
        } else {
            // The difficulties are different or one of the documents does not exist
            console.log('Difficulties are different or one of the documents does not exist')
            return true
        }
    } catch (error) {
        console.log('Error getting missions: ', error);
    }
    return false
}
