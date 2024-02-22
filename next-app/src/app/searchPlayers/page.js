"use client"
import React from 'react';

import { searchUsers } from "@/app/user_actions"
import { useRouter } from "next/navigation";
import SearchResultsComponent from '@/components/SearchResults/searchResults'

function SearchSuggestion({ users, selected, visible }) {
    if (!visible || !users || users.length < 1)
        return <></>

    return <ul id="search-suggestions" className="fixed w-96 border-2 bg-white border-tq-primary rounded-lg text-black overflow-hidden">
        {
            users.map((u, i) => {
                let classes = "hover:bg-slate-200"
                if (i == selected)
                    classes = "bg-tq-accent text-white"

                return <a key={u.username} href={`/profile/${u.username}`}>
                    <li className={classes}>{u.username}
                    </li></a>
            })
        }
    </ul>
}

export default function Searchbar({ }) {
    // searchUsers returns an array of users
    const [searchResults, setSearchResults] = React.useState([]);

    const [searchSuggestions, setSearchSuggestions] = React.useState([]);
    const [suggestionSelection, setSuggestionSelection] = React.useState(-1)
    const [suggestionVisible, setSuggestionVisible] = React.useState(false)

    const [error, setError] = React.useState("");
    const router = useRouter()

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
        if (result.length == 0) {
            setError("No results found");
        }
        setSearchResults(result);
    }

    async function onChange(event) {
        let username = event.target.value
        if (!username) {
            setSearchSuggestions([])
            return
        }
        setSearchSuggestions(await searchUsers(username))
        setSuggestionSelection(-1)
    }

    function onKeyDown(event) {
        if (event.code === "ArrowUp") {
            setSuggestionSelection(x => {
                return Math.max(-1, x - 1)
            })
        } else if (event.code === "ArrowDown") {
            setSuggestionSelection(x => {
                return Math.min(searchSuggestions.length - 1, x + 1)
            })
        } else if (event.code === "Enter") {
            if (suggestionSelection >= 0 && suggestionSelection < searchSuggestions.length) {
                event.preventDefault()
                // navigate to the profile of the selected user
                router.push(`/profile/${searchSuggestions[suggestionSelection].username}`)
            }
        }
        else if (event.code === "Escape") {
            document.activeElement.blur()
        }
    }

    return (
        <div className='text-center mt-20'>
            <div >
                <form className="w-96 m-auto" onSubmit={handleSubmit}>
                    <div className="w-full flex border-2 border-tq-primary rounded-full overflow-hidden">
                        <input
                            className="w-9/12 h-10  px-2 py-1 bg-white text-black"
                            autoComplete="off"
                            name="username"
                            type="text"
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            onBlur={()=>{
                                setSuggestionVisible(false)
                            }}
                            onFocus={()=>{
                                setSuggestionVisible(true)
                            }}
                            placeholder="Search for a player" />
                        <button className="w-3/12 h-10 inline bg-tq-primary hover:bg-tq-accentfont-bold rounded-none" type="submit">Search</button>
                    </div>
                    <SearchSuggestion users={searchSuggestions} selected={suggestionSelection} visible={suggestionVisible}/>
                </form>
            </div>
            {searchResults.length != 0 ? <SearchResultsComponent results={searchResults} /> : <></>}
            <text className="text-red-400"> {error}</text>
        </div>
    );
}
