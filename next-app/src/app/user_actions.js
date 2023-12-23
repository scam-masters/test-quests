"use client"

import { db } from "@/firebase/index";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function getUserData() {
    const auth = getAuth();
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.email);
    const document = await getDoc(docRef);
    return document.data()
}

// WARNING: This function is not used yet, not tested
// It could be moved server-side but I haven't tested it yet
export async function updateUserScore(missionId, score) {
    const userData = await getUserData()

    // Update the score only if it is higher than the previous one
    if (score > userData.missions[missionId].score) {
        userData.missions[missionId].score = score
        userData.score += score
        // await setDoc(docRef, { score: userData.score, missions.missionId.score: score }, { merge: true });
    }
}