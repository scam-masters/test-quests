"use client"

import { db, app } from "@/firebase/index";
import { doc, getDoc, getDocs, setDoc, query, collection, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";


/* Utility functions */

/**
 * Retrieves a user by their username.
 * @param {string} username - The username of the user to retrieve.
 * @returns {Promise<{ref: DocumentReference, data: Object}>} - A promise that resolves to an object containing the reference and data of the user.
 * @throws {Error} - If the user is not found.
 */
async function getUserByUsername(username) {
    const usersRef = collection(db, "users");
    const userSnapshot = await getDocs(query(usersRef, where("username", "==", username)));

    if (!userSnapshot.empty) {
        return {
            ref: userSnapshot.docs[0].ref,
            data: userSnapshot.docs[0].data()
        };
    } else {
        throw new Error("User not found");
    }
}

/**
 * Updates a user document in the database.
 * @param {DocumentReference} userRef - The reference to the user document.
 * @param {Object} userData - The updated user data.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
 */
async function updateUser(userRef, userData) {
    await setDoc(userRef, userData, { merge: true });
}


/* Exported Functions */

/**
 * Retrieves the avatar of a user by their username.
 * @param {string} username - The username of the user.
 * @returns {Promise<string>} The URL of the user's avatar.
 */
export async function getAvatarByUsername(username) {
    const user = await getUserByUsername(username);
    return user.data.avatar;
}

/**
 * Retrieves the user data from the Firestore database.
 * @returns {Promise<Object>} The user data object.
 */
export async function getUserData() {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.email);
    const document = await getDoc(docRef);
    return document.data()
}

/**
 * Searches for users based on a given search string.
 * @param {string} searchString - The search string to match against usernames.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of user data objects.
 */
export async function searchUsers(searchString) {
    const usersRef = collection(db, "users")
    const docs = await getDocs(query(usersRef, where("username", ">=", searchString), where("username", "<=", searchString + "\uf8ff")))

    const result = []
    docs.forEach(doc => {
        result.push(doc.data())
    })

    return result
}

/**
 * Sets the user data in the database.
 * 
 * @param {Object} userData - The user data to be set.
 * @returns {Promise<void>} - A promise that resolves when the user data is successfully set.
 */
export async function setUserData(userData) {
    const auth = getAuth();
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.email);
    await updateUser(docRef, userData);
}

/**
 * Sets a new username for the authenticated user.
 * 
 * @param {Object} auth - The authentication object.
 * @param {string} newUsername - The new username to set.
 * @throws {Error} If the new username is already taken.
 * @returns {Promise<void>} A promise that resolves when the username is successfully set.
 */
export async function setNewUsername(auth, newUsername) {
    // check the username is not already taken
    const usersRef = collection(db, "users")
    const docs = await getDocs(query(usersRef, where("username", "==", newUsername)))
    if (!docs.empty) {
        throw new Error("Username already taken")
    }

    // get current user data
    const currentUser = auth.currentUser;
    const currentUserRef = doc(db, "users", currentUser.email);
    const currentUserDoc = await getDoc(currentUserRef);
    const currentUserData = currentUserDoc.data()

    // change username in all friends lists and friend requests lists
    // by erasing the old username and adding the new one
    const friends = currentUserData.friends
    for (const friendUsername of friends) {
        const { data: friend, ref: friendRef } = await getUserByUsername(friendUsername);
        friend.friends = friend.friends.filter(f => f !== currentUserData.username);
        friend.friends.push(newUsername);
        await updateUser(friendRef, friend);
    }

    // check, for each user in the database, if the user is in their friend_requests list
    const users = await getDocs(usersRef);
    for (const userDoc of users.docs) {
        const user = userDoc.data();
        if (user.friend_requests.includes(currentUserData.username)) {
            user.friend_requests = user.friend_requests.filter(f => f !== currentUserData.username);
            user.friend_requests.push(newUsername);
            await updateUser(userDoc.ref, user);
        }
    }

    // change username in the user's data
    currentUserData.username = newUsername
    await setDoc(currentUserRef, currentUserData, { merge: true });
}

/**
 * Sets a new avatar for the authenticated user.
 * @param {Object} auth - The authentication object.
 * @param {number} newAvatarIndex - The index of the new avatar.
 * @returns {Promise<void>} - A promise that resolves when the new avatar is set.
 */
export async function setNewAvatar(auth, newAvatarIndex) {
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.email);
    const document = await getDoc(docRef);
    const userData = document.data()
    userData.avatar = newAvatarIndex
    await setDoc(docRef, userData, { merge: true });
}

/**
 * Updates the initial score for the user.
 * If the user's score is -1, it sets the score to 0.
 * @returns {Promise<void>} A promise that resolves when the score is updated.
 */
export async function updateInitialScore() {
    await getUserData().then(userData => {
        if (userData.score == -1) {
            userData.score = 0
            setUserData(userData)
        }
    })
}

/**
 * Updates the user's score for a specific mission.
 * 
 * @param {string} missionId - The ID of the mission.
 * @param {number} newMissionScore - The new score for the mission.
 * @param {number} correctness - The correctness of the user's submission.
 * @param {number} threshold - The threshold for unlocking the next mission.
 * @returns {Promise<void>} - A promise that resolves when the user's score is updated.
 */
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

        // unlock the next mission only when the user has achieved a correctness above the threshold
        if (correctness >= threshold) {
            const missionNumber = missionId.split("_")[1]
            const nextMissionId = "mission_" + (parseInt(missionNumber) + 1).toString()

            const exerciseDoc = await getDoc(doc(db, "exercises", missionId));
            const exerciseData = exerciseDoc.data();
            const nextExerciseDoc = await getDoc(doc(db, "exercises", nextMissionId));
            const nextExerciseData = nextExerciseDoc.data();

            // if the next mission is in the same storyline unlock it
            // otherwise, it means that the user has finished the storyline and nothing needs to be done
            if (nextExerciseData.storyline == exerciseData.storyline)
                userData.missions[nextMissionId] = { id: nextMissionId, score: -1 }

            // query the db to check how many missions of the same kind the user has completed    
            const usersRef = collection(db, "users")
            const docsKind = await getDocs(query(usersRef, where("kind", "==", exerciseData.kind)))

            // if the user has completed 5 or 10 missions of the same kind, give him a badge
            if (docsKind.length === 5 || docsKind.length === 10) {
                userData.badges.push(`${docsKind.length}_${userData.missions[missionId].kind}`)
            }
        }
        if (correctness == 100) {
            // query the db to check if a user already achieved 100% on this mission
            const usersRef = collection(db, "users")
            const docs = await getDocs(query(usersRef, where("missions." + missionId + ".score", "==", newMissionScore)))

            // if the user is the first to achieve 100% on this mission, give him a first blood badge
            if (docs.empty) {
                userData.badges.push("first_blood")
            }
        }
        setUserData(userData)
    }
}

/**
 * Retrieves the score of a user for a specific mission.
 * @param {string} missionId - The ID of the mission.
 * @returns {Promise<number>} - The score of the user for the mission.
 */
export async function getUserScoreForMission(missionId) {
    const userData = await getUserData()
    return userData.missions[missionId].score
}

/**
 * Updates the chapter unlocking logic based on the given mission ID.
 * @param {string} missionId - The ID of the current mission.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the chapter has been successfully unlocked.
 */
export async function updateChapterUnlocking(missionId) {
    // retrieve the mission id of the current and the next one
    const missionNumber = missionId.split("_")[1]
    const nextMissionId = "mission_" + (parseInt(missionNumber) + 1).toString()
    console.log(missionId, nextMissionId)
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

        // Check if the documents exist and have the 'difficulty' field or if the storyline is finished if they have the same storyline
        if (missionDoc && nextMissionDoc && missionDoc.data().difficulty == nextMissionDoc.data().difficulty) {
            // The difficulties or the storyline are the same
            if (missionDoc.data().storyline == nextMissionDoc.data().storyline) {
                console.log("Same storyline")
                return false
            } {// in this way even if we start a storyline with hard difficulty we can obtain the badge of the chapter completion
                console.log("Different storylines")
                const userData = await getUserData()
                if (userData.badges.includes(`chapter_completion_${missionDoc.data().difficulty}`)) {
                    return false
                }
                userData.badges.push(`chapter_completion_${missionDoc.data().difficulty}`)
                setUserData(userData)
                return true
            }
        } else {
            // The difficulties are different or we have changed the storyline
            console.log("different difficulties or storylines")
            const userData = await getUserData()
            if (userData.badges.includes(`chapter_completion_${missionDoc.data().difficulty}`)) {
                return false
            }
            userData.badges.push(`chapter_completion_${missionDoc.data().difficulty}`)
            setUserData(userData)
            return true
        }
    } catch (error) {
        console.log('Error getting missions: ', error);
    }
    console.log("No next mission, out of scope")
    return false
}

// Retrieve scoreboard data (mock for testing)
/**
 * Retrieves the scoreboard data from the database.
 * 
 * @returns {Promise<Array<Object>>} The scoreboard data, sorted by score and timestamp.
 */
export async function getScoreboardData() {
    const usersRef = collection(db, "users")

    const docs = await getDocs(query(usersRef, where("score", ">=", 0)))

    const data = []

    // maybe we can get clever with firebase and have it sort and compute last timestamp in the db
    docs.forEach(doc => {
        let timestamp = 0
        let completedCount = 0
        for (let key in doc.data().missions) {
            let missionData = doc.data().missions[key]
            if (missionData.timestamp) {
                timestamp = Math.max(doc.data().missions[key].timestamp, timestamp)
                completedCount += 1
            }
        }

        data.push({
            username: doc.data().username,
            score: doc.data().score,
            timestamp: timestamp,
            completedCount
        })
    })

    data.sort((a, b) => {
        if (a.score == b.score && a.timestamp == b.timestamp)
            return 0
        if (a.score > b.score || (a.score == b.score && a.timestamp < b.timestamp))
            return -1
        return 1
    })
    return data
}

/**
 * Adds a friend request from the current user to the specified receiver.
 * 
 * @param {string} receiverUsername - The username of the receiver.
 * @throws {Error} If the receiver is already a friend.
 * @throws {Error} If a friend request has already been sent to the receiver.
 * @throws {Error} If a friend request has already been received from the receiver.
 * @returns {Promise<void>} A promise that resolves when the friend request is successfully added.
 */
export async function addFriendRequest(receiverUsername) {
    const sender = await getUserData();
    console.log("Friends requests from: ", sender.username, " to: ", receiverUsername);

    const { data: receiver, ref: receiverRef } = await getUserByUsername(receiverUsername);

    if (receiver.friends.includes(sender.username)) {
        throw new Error("Already friends");
    }

    if (receiver.friend_requests.includes(sender.username)) {
        throw new Error("Friend request already sent");
    }

    if (sender.friend_requests.includes(receiver.username)) {
        throw new Error("Friend request already received from this user")
    }

    receiver.friend_requests.push(sender.username);
    await updateUser(receiverRef, receiver);
}

/**
 * Accepts a friend request from a sender.
 * 
 * @param {string} senderUsername - The username of the sender.
 * @returns {Promise<void>} - A promise that resolves when the friend request is accepted.
 * @throws {Error} - If the sender and receiver are already friends.
 */
export async function acceptFriendRequest(senderUsername) {
    const receiver = await getUserData();
    console.log("Accept friend request from: ", senderUsername, " to: ", receiver.username);

    const { data: sender, ref: senderRef } = await getUserByUsername(senderUsername);

    if (sender.friends.includes(receiver.username) || receiver.friends.includes(sender.username)) {
        throw new Error("Already friends");
    }

    receiver.friends.push(sender.username);
    sender.friends.push(receiver.username);
    receiver.friend_requests = receiver.friend_requests.filter(request => request !== senderUsername);
    await updateUser(senderRef, sender);
    await setUserData(receiver);
}

/**
 * Declines a friend request from a sender.
 * 
 * @param {string} senderUsername - The username of the sender.
 * @returns {Promise<void>} - A promise that resolves when the friend request is declined.
 */
export async function declineFriendRequest(senderUsername) {
    const user = await getUserData();
    console.log("Decline friend request from: ", senderUsername, " to: ", user.username);

    user.friend_requests = user.friend_requests.filter(request => request !== senderUsername);
    await setUserData(user);
}