"use client";
// Import necessary packages
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";


// TODO: investigate further if we should use "use server" to avoid leaks of credentials
function Login() {
  // Get authentication instance
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="bg-cover bg-center flex justify-center items-center min-h-screen">
      <div className="bg-black bg-opacity-80 text-white w-96 p-8 rounded-lg shadow-md mt-[-150px]">
        <h1 className="mb-2 text-3xl text-center font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="flex flex-col text-white">
            <span className="mb-1">Email:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            />
          </label>
          <label className="flex flex-col text-white">
            <span className="mb-1">Password:</span>
            <input
              className="border rounded px-2 py-1 text-black"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="bg-tq-primary hover:bg-tq-accent text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
          <div className="text-center mt-4">
            Don't have an account?
            <Link href={"#"} className="text-white-500 hover:underline">
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
