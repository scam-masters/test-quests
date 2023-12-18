"use client";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../firebase/index";


const auth = getAuth();

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            window.location.href = "/";

        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="p-4 w-3/12 mx-auto my-auto">
            <h1 className="text-4xl text-white  mb-4 font-bold mx-auto text-center">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <label className="flex flex-col">
                    <span className="mb-1 text-white text-2xl">Email:</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded px-2 py-1"
                    />
                </label>
                <label className="flex flex-col">
                    <span className="mb-1 text-white text-2xl">Password:</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded px-2 py-1"
                    />
                </label>
                <button
                    type="submit"
                    className="rounded bg-tq-primary hover:bg-tq-accent font-bold py-2 px-4 rounded w-1/2 mt-sm mx-auto"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Login;