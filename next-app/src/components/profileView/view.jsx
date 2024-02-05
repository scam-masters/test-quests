'use client';
import React, { useState } from "react";
import Button from "@/components/button/button";
// import { Dialog } from "primereact/dialog";
// import { updateAvatar, updateUsername } from "@/app/user_actions.js"
export default function ProfileView({ owner, email, avatar, badges, username, score}) {

    return (
        <>
            <div className="flex flex-row items-center">
                <img src={`/avatars/${avatar}.png`} alt={`avatar${avatar}`} className="w-20 h-20 rounded-full m-4" />
                {owner ? <Button text="Change avatar"/> : ""}

                <div className="ml-4">
                    <h1 className="text-3xl font-bold text-blue-700">{username}</h1>
                    {owner ? <Button text="Change username"/> : ""}

                    {owner ? <p className="text-xl text-gray-600">{email}</p>: ""}

                    <p className="text-xl text-gray-600">{score}</p>

                    <div className="flex flex-row mt-4">
                        {badges.map((badge, index) => {
                            return (
                                <img key={index} src={`/badges/${badge}.png`} alt={`badge${badge}`} className="w-10 h-10 mr-2" />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}