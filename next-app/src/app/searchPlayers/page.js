"use client"
import React from 'react';

import { searchUsers } from "@/app/user_actions"
import SearchResultsComponent from '@/components/SearchResults/searchResults'

export default function Searchbar({ }) {
    // searchUsers returns an array of users
    const [searchResults, setSearchResults] = React.useState([]);
    const [error, setError] = React.useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        let formData = new FormData(event.target);
        // if the search bar is empty, don't search and clear the results
        if (formData.get("username") == "") {
            setSearchResults([]);
            return;
        }
        let result = await searchUsers(formData.get("username"));
        console.log(result);
        if (result.length == 0) {
            setError("No results found");
        }
        setSearchResults(result);
    }

    return (
        <div className='text-center mt-20'>
            <div >
                <form onSubmit={handleSubmit}>
                    <input className="w-80 h-10 border-2 border-tq-primary rounded-full px-2 py-1 bg-white text-black" name="username" type="text" placeholder="Search for a player"/>
                    <button className="ml-3 bg-tq-primary hover:bg-tq-accentfont-bold py-2 px-4 rounded-5" type="submit">Search</button>
                </form>
            </div>
            { searchResults.length != 0 ? <SearchResultsComponent results={searchResults} /> : <></> }
            <text className="text-red-400"> {error}</text>
        </div>
    );
}