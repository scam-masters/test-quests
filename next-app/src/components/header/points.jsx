"use client"
import React from 'react';
import { FaStar } from 'react-icons/fa';

const Points = ({ points, username }) => {
    if (!username) {
        return (<div>  </div>);
    }

    if (points === -1) {
        points = "-";
    }

    return (
        <div className={`flex items-center mr-2`}>
            <a className="text-white font-bold mr-10" href={`/profile/${username}`}>{username}</a>
            <FaStar className="text-white mr-2" />
            <span className="text-white font-bold mr-5">{points}</span>
        </div>
    );
};

export default Points;
