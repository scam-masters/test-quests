"use client"

import { db, app } from "@/firebase/index";
import { doc, getDoc, getDocs, setDoc, query, collection, where } from "firebase/firestore";
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

export async function setNewUsername(auth, newUsername) {
    // check the username is not already taken
    const usersRef = collection(db, "users")
	const docs = await getDocs(query(usersRef, where("username", "==", newUsername)))
    if (!docs.empty) {
        throw new Error("Username already taken")
    }
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.email);
    const document = await getDoc(docRef);
    const userData = document.data()
    userData.username = newUsername
    await setDoc(docRef, userData, { merge: true });
}


export async function setNewAvatar(auth, newAvatarIndex) {
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.email);
    const document = await getDoc(docRef);
    const userData = document.data()
    userData.avatar = newAvatarIndex
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
        userData.score = Math.max(userData.score, 0) + newMissionScore - Math.max(userData.missions[missionId].score, 0)
        
        // update mission data (relative to the user)
        userData.missions[missionId].score = newMissionScore
        userData.missions[missionId].timestamp = Date.now()
        
        // unlock the next mission only when we get max score
        if (correctness >= threshold) {
            const missionNumber = missionId.split("_")[1]
            const nextMissionId = "mission_" + (parseInt(missionNumber) + 1).toString()
            userData.missions[nextMissionId] = { id: nextMissionId, score: -1 }

            const exerciseDoc = await getDoc(doc(db, "exercises", missionId));
            const exerciseData = await exerciseDoc.data(); 

            const usersRef = collection(db, "users")
            const docsKind = await getDocs(query(usersRef, where("kind", "==", exerciseData.kind)))
            
            if (docsKind.length === 5 || docsKind.length === 10) {
                userData.badges.push(`${docsKind.length}_${userData.missions[missionId].kind}`)
            }
        }
        console.log("correctness: ", correctness)
        if (correctness == 100) {
            // query the db to check if a user already achieved 100% on this mission
            const usersRef = collection(db, "users")
            const docs = await getDocs(query(usersRef, where("missions." + missionId + ".score", "==", newMissionScore)))
            console.log("missionId: ", missionId)
            console.log("docs: ", docs)
            if (docs.empty) {
                userData.badges.push("first_blood")
            }
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
        const missionRef = doc(db, 'exercises', missionId)
        /*** TODO: 
         * 			add logic for when the user have finished the last mission in the storyline
         *          because you can't retrieve the next missions (there aren't) 
         * ***/
        const nextMissionRef = doc(db, 'exercises', nextMissionId)

        const missionDoc = await getDoc(missionRef)
        const nextMissionDoc = await getDoc(nextMissionRef)

        // Check if the documents exist and have the 'difficulty' field
        if (missionDoc && nextMissionDoc && missionDoc.data().difficulty == nextMissionDoc.data().difficulty) {
            // The difficulties are the same
            console.log('Difficulties are the same:', missionDoc.data().difficulty)
            return false
        } else {
            // The difficulties are different or one of the documents does not exist
            const userData = await getUserData()
            userData.badges.push(`chapter_completion_${missionDoc.data().difficulty}`)
            setUserData(userData)
            return true
        }
    } catch (error) {
        console.log('Error getting missions: ', error);
    }
    return false
}

export async function addFriendRequest(receiverUsername) {
    const sender = await getUserData()

    const receiverRef = doc(db, "users", receiverUsername);
    const receiverSnapshot = await getDoc(receiverRef);

    if (receiverSnapshot.exists()) {
        const receiver = receiverSnapshot.data();

        if (receiver.friend_requests.includes(sender.username)) {
            throw new Error("Friend request already sent");
        }
        else {
            receiver.friend_requests.push(sender.username);
        }
        console.log("Friends requests from: ", sender.username, " to: ", receiver.username);
        await setDoc(receiverRef, receiver, { merge: true });
    } else {
        throw new Error("User not found");
    }
}