"use client"
import React from 'react';

import { searchUsers } from "@/app/user_actions"
import { useRouter } from "next/navigation";
import SearchResultsComponent from '@/components/searchResults/searchResults'

/**
 * Renders a list of search suggestions based on the provided users array.
 *
 * @param {Object[]} users - The array of user objects.
 * @param {number} selected - The index of the currently selected suggestion.
 * @param {boolean} visible - Indicates whether the search suggestions are visible or not.
 * @returns {JSX.Element} The rendered search suggestions list.
 */

// component that renders on screen the search suggestions (a list of users navigable by arrow keys and enter key)
function SearchSuggestion({ users, selected, visible }) {
    // users, selected, and visible are useState variables
    if (!visible || !users || users.length < 1)
        return <></>

    return <ul id="search-suggestions" className="fixed w-96 border-2 bg-white border-tq-accent rounded-lg text-black overflow-hidden">
        {
            users.map((u, i) => {
                let classes = "hover:bg-slate-200"
                if (i == selected)
                    classes = "bg-tq-accent text-white"

                return <a key={u.username} className='suggestion' href={`/profile/${u.username}`}>
                    <li className={classes}>{u.username}
                    </li></a>
            })
        }
    </ul>
}

/**
 * A search bar component for searching players.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The search bar component.
 */
export default function Searchbar({ }) {
    // searchUsers returns an array of users
    const [searchResults, setSearchResults] = React.useState([]);

    const [searchSuggestions, setSearchSuggestions] = React.useState([]);
    // suggestionSelection is the index of the currently selected suggestion in the searchSuggestions array
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
        // search for the user in the database
        let result = await searchUsers(formData.get("username"));
        if (result.length == 0) {
            setError("No results found");
        }
        setSearchResults(result);
    }
    // this function is called when the input in the search bar changes
    async function onChange(event) {
        let username = event.target.value
        if (!username) {
            setSearchSuggestions([])
            return
        }
        // search for users with the provided username on the database and set the searchSuggestions array to the result
        setSearchSuggestions(await searchUsers(username))
        // reset the suggestion selection when the input changes (index = -1 means no selection)
        setSuggestionSelection(-1)
    }

    function onKeyDown(event) {
        if (event.code === "ArrowUp") {
            event.preventDefault()
            setSuggestionSelection(x => {
                return Math.max(-1, x - 1)
            })
        } else if (event.code === "ArrowDown") {
            event.preventDefault()
            setSuggestionSelection(x => {
                return Math.min(searchSuggestions.length - 1, x + 1)
            })
        } else if (event.code === "Enter") {
            // if a suggestion is selected, navigate to the profile of the selected user
            if (suggestionSelection >= 0 && suggestionSelection < searchSuggestions.length) {
                event.preventDefault()
                // navigate to the profile of the selected user
                router.push(`/profile/${searchSuggestions[suggestionSelection].username}`)
            }
        }
        else if (event.code === "Escape") {
            // document.activeElement returns the Element within the document that is currently focused
            // blur() method removes focus from it. 
            document.activeElement.blur()
        }
    }

    return (
        <div className='text-center mt-10 space-y-4'>
            <h1 className="text-3xl font-bold text-tq-white">Search for a player</h1>
            <div
            >
                <form className="w-96 m-auto" onSubmit={handleSubmit}
                >
                    <div className="w-full flex border-2 rounded-full overflow-hidden">
                        <input
                            className="w-9/12 h-10 px-2 py-1 bg-white text-black"
                            // disables the browser's autocomplete
                            autoComplete="off"
                            name="username"
                            type="text"
                            // if the user clicks outside the search bar and not inside the suggestions area, hide the suggestions
                            onBlur={(e) => {
                                if (e?.relatedTarget?.className != 'suggestion')
                                    setSuggestionVisible(false)
                            }}
                            // if the user clicks inside the search bar, show the suggestions (if there are any word inside the search bar)
                            onFocus={() => {
                                setSuggestionVisible(true)
                            }}
                            // fired when the value of the input field changes
                            onChange={onChange}
                            // event handler for the keydown event fired when a key is pressed 
                            onKeyDown={onKeyDown}
                            placeholder="Search for a player" />
                        <button className="w-3/12 h-10 inline background-gradient font-bold rounded-none" type="submit">Search</button>
                    </div>
                    <SearchSuggestion users={searchSuggestions} selected={suggestionSelection} visible={suggestionVisible} />
                </form>
            </div>
            {/* component that shows the search results (similar to the scoreboard component) */}
            {searchResults.length != 0 ? <SearchResultsComponent results={searchResults} /> : <></>}
            <text className="text-red-400"> {error}</text>
        </div>
    );
}
