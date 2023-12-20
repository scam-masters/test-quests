"use client";
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../firebase/index";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 

const auth = getAuth();

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  //const [counter, setCounter] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // we need to store the username
      const q = query(collection(db, "users"), where("username", "==", username));

      const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   setCounter(1)
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      // });

      // find if the username is already present and if is not present in the snapshot returned by the query,
      // then complite the registration of the user
      if(querySnapshot.empty) {
        // Add a new document in collection "users" with the selected username and an empty score
        // Since email is unique, as ID of the document we set the user email
        await setDoc(doc(db, "users", email), {
          username: username,
          score: 0,
        });
        window.location.href = "/";
      }
      else {
        // print username already taken
        console.log("username gia' preso");
      }

    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="bg-cover bg-center flex justify-center items-center min-h-screen">
      <div className="bg-black bg-opacity-80 text-white w-96 p-8 rounded-lg shadow-md mt-[-150px]">
        <h1 className="mb-2 text-3xl text-center font-bold">Registration</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="flex flex-col text white">
            <span className="mb-1">Username:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded px-2 py-1 text-black"
              required
            />
          </label>
          <label className="flex flex-col text white">
            <span className="mb-1">Email:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded px-2 py-1 text-black"
              required
            />
          </label>
          <label className="flex flex-col text-white">
            <span className="mb-1">Password:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded px-2 py-1 text-black"
              required
              minLength="8"
            />
          </label>
          <button
            type="submit"
            className="bg-tq-primary hover:bg-tq-accent text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
