export default function SearchResultsComponent({ results }) {
    // itearate over the results array and display the username and score of each user as in the scoreboard
    return (
        <div className="p-4 max-w-screen-xl m-auto">
            <div className="tq-black rounded-lg text-center overflow-hidden text-tq-white border-2 border-tq-accent">
                <h1 className="text-xl font-bold py-2 px-4 background-gradient text-tq-white text-center">RESULTS</h1>
                <table className="searchResults">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            results.map((entry, index) => (
                                <tr key={index}>
                                    <td title="View the profile" className="underline text-sky-500"><a href={`/profile/${entry.username}`}>{entry.username}</a></td>
                                    {/* avoid showing -1 as score */}
                                    <td>{entry.score == -1 ? 0 : entry.score}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
