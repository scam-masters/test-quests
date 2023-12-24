"use client"
import React from 'react';
import { FaStar } from 'react-icons/fa'; 

const Points = ({ points, username }) => {

    return (
        <div className={`flex items-center mr-2`}>
            <span className="text-white font-bold mr-10">{username}</span>
            <FaStar className="text-white mr-2" />
            <span className="text-white font-bold">{points}</span>
        </div>
    );
};

export default Points;
