"use client"
import React from 'react';
import { FaStar } from 'react-icons/fa'; 

const Points = ({ points, username }) => {

	var custom_classes = 'mr-2';

    return (
        <div className={`flex items-center ${custom_classes}`}>
            <span className="text-white font-bold mr-10">{username}</span>
            <FaStar className="text-white mr-2" />
            <span className="text-white font-bold">{points}</span>
        </div>
    );
};

export default Points;
